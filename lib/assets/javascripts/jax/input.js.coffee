#= require_self
#= require_tree './input'

class Jax.Input
  @include Jax.Events.Methods
  
  constructor: (@receiver) ->
    @_listeners = {}
    @receiver.getEventListeners = (type) => @getReceiverEventListeners type
    
  getReceiverEventListeners: (type) -> @_listeners[type] or= []
  
  ###
  Subclasses can override this method if they need to maintain themselves
  over time. The default implementation does nothing. Timechange is in 
  seconds.
  ###
  update: (timechange) ->
    
  ###
  Manually triggers an event on the underlying receiver. This is mostly
  used for testing. Subclasses must override this method; the default
  implementation just raises an error.
  ###  
  trigger: (type, event) ->
    throw new Error "#{@__proto__.constructor.name} can't trigger event type #{type}: not implemented"
      
  ###
  Convenience method that just registers the specified event listener with
  the input receiver. Ensures that the specific callback is only ever
  registered once.
  ###
  attach: (eventType, callback) ->
    listeners = @getReceiverEventListeners(eventType)
    unless listeners.interface
      listeners.interface = (evt) =>
        listener.call(this, evt) for listener in listeners
      @receiver.addEventListener eventType, listeners.interface
    listeners.push callback
    
  ###
  Removes all event listeners from the input receiver.
  ###
  stopListening: ->
    for type of @_listeners
      listeners = @getReceiverEventListeners type
      if listeners.interface
        @receiver.removeEventListener type, listeners.interface
        listeners.length = 0
        delete listeners.interface

  ###
  Starts listening for a specific event type. The callback is optional and
  if specified, will be fired every time this input device fires the specified
  event type.
  ###
  listen: (type, callback) ->
    if this[type]
      if eventType = @__proto__.constructor.eventTypes?[type]
        @attach eventType, this[type]
        @addEventListener type, callback if callback
      else
        throw new Error "BUG: Method `#{type}` exists but no corresponding DOM event type associated"
    else throw new Error "Invalid #{@__proto__.constructor.name} input type: #{type}"
    