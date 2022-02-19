/***
 * class used to handle save events for L.SaveToolbar
 **/
L.SaveToolbar.Save = L.Handler.extend({

    statics: {
        TYPE: 'save'
    },

    // @method initialize(): void
    initialize: function (map, options) {

       L.Handler.prototype.initialize.call(this, map);

       L.setOptions(this, options);

        // Store the selectable layer group for ease of access
        this._featureGroup = options.featureGroup;

        if (!(this._featureGroup instanceof L.FeatureGroup)) {
            throw new Error('options.featureGroup must be a L.FeatureGroup');
        }

        // Save the type so super can fire, need to do this as cannot do this.TYPE :(
        this.type = L.SaveToolbar.Save.TYPE;

        this._initialLabelText = "";

        var version = L.version.split('.');
        //If Version is >= 1.2.0
        if (parseInt(version[0], 10) === 1 && parseInt(version[1], 10) >= 2) {
            L.SaveToolbar.Save.include(L.Evented.prototype);
        } else {
            L.SaveToolbar.Save.include(L.Mixin.Events);
        }
    },

    // @method enable(): void
    enable: function () {

        if (!this._hasAvailableLayers()) {
            return;
        }

        // if map has drawn items, save them to the database
        this._saveFeaturesToDatabase();
    },

    _saveFeaturesToDatabase: function () {
        // convert and stringify drawn items before sending it to the database
        var featureCollection = JSON.stringify(drawnItems.toGeoJSON());

        saveFeaturesToSqlDatabase(featureCollection);
    },

    _hasAvailableLayers: function () {
        return this._featureGroup.getLayers().length !== 0;
    }
});