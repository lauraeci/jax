class Jax.Dev.Views.Tools.Lights extends Backbone.View
  template: JST['jax/dev/tools/light']

  initialize: ->
    @jax = @options.context
    @jax.world.on 'lightAdded', @add
    @jax.world.on 'lightRemoved', @remove
    @render()

  add: (light) =>
    @$el.append new Jax.Dev.Views.Tools.Lights.Item(
      model: light
    ).$el

  remove: (light) =>
    @$("*[data-id=#{light.__unique_id}]").remove()

  render: =>
    @$el.empty()
    for light in @jax.world.lights
      @add light
    true
