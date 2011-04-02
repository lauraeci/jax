//= require "light_source"

Jax.Scene.LightManager = (function() {
  return Jax.Class.create({
    initialize: function(context) {
      this.context = context;
      this._lights = [];
    },
    
    add: function(light) {
      if (this._lights.length == Jax.max_lights)
        throw new Error("Maximum number of light sources in a scene has been exceeded! Try removing some first.");
      this._lights.push(light);
    },
    
    enable: function() { this.enabled = true; },
    
    disable: function() { this.enabled = false; },
    
    isEnabled: function() {
      if (arguments.length == 1) {
        if (this._lights.length > arguments[0])
          return this._lights[arguments[0]].isEnabled();
        return false;
      }
      
      if (this.enabled != undefined)
        return this.enabled;
      return this._lights.length > 0;
    },
    
    count: function() { return this._lights.length; },
    
    remove: function(index) {
      var result = this._lights.splice(index, 1);
      if (this._lights.length == 0) delete this.enabled;
      return result;
    },
    
    illuminate: function(context, objects) {
      for (var i = 0; i < this._lights.length; i++) {
        this._current_light = i;
        for (var j = 0; j < objects.length; j++) {
          /* TODO optimization: see if objects[j] is even affected by this._lights[i] */
          objects[j].render(context);
        }
      }
      delete this._current_light;
    },
    
    updateShadowMaps: function(context, objects) {
      var boundingRadius = null;
      var i, j;
      for (i = 0; i < objects.length; i++) {
        j = vec3.length(objects[i].camera.getPosition()) + objects[i].getBoundingSphereRadius();
        if (boundingRadius == null || boundingRadius < j)
          boundingRadius = j;
      }
      boundingRadius = boundingRadius || 0;
      
//      context.glPolygonOffset(1.1, 4.0);
//      context.glPolygonOffset(2,2);
//      context.glEnable(GL_POLYGON_OFFSET_FILL);
      for (i = 0; i < this._lights.length; i++) {
        this._lights[i].updateShadowMap(context, boundingRadius, objects);
//        break;
      }
//      context.glDisable(GL_POLYGON_OFFSET_FILL);
//      context.glPolygonOffset(0.0, 0.0);
    },
    
    getDirection: function(index) { return this.getLight(index).getDirection(); },
    
    getPosition: function(index) { return this.getLight(index).getPosition(); },
    
    getLight: function(index) {
      if (index == undefined)
        if (this._current_light != undefined) return this._lights[this._current_light];
        else return (this.default_light = this.default_light || new Jax.Scene.LightSource());
      return this._lights[index];
    },
    
    getType: function(index) { return this.getLight(index).getType(); },
    
    getDiffuseColor: function(index) { return this.getLight(index).getDiffuseColor(); },
    
    getSpecularColor: function(index) { return this.getLight(index).getSpecularColor(); },
    
    getAmbientColor: function(index) { return this.getLight(index).getAmbientColor(); },
    
    getConstantAttenuation: function(index) { return this.getLight(index).getConstantAttenuation(); },
    
    getLinearAttenuation: function(index) { return this.getLight(index).getLinearAttenuation(); },
                                                                                                                                  
    getQuadraticAttenuation: function(index) { return this.getLight(index).getQuadraticAttenuation(); },
    
    getSpotCosCutoff: function(index) { return this.getLight(index).getSpotCosCutoff(); },
    
    getSpotExponent: function(index) { return this.getLight(index).getSpotExponent(); }
  });
})();
