/***
 * class used for creating custom Leaflet.draw extended save toolbar  
 */
L.SaveToolbar = L.Toolbar.extend({

    statics: {
        TYPE: 'save'
    },

    options: {
        save: {},
        featureGroup: new L.FeatureGroup()
    },

    // @method initialize(): void
    initialize: function (options) {

        this._toolbarClass = 'leaflet-draw-save';
        L.Toolbar.prototype.initialize.call(this, options);
    },

    // @method getModeHandlers(): object
    // Get mode handlers information
    getModeHandlers: function (map) {
        var featureGroup = this.options.featureGroup;
        return [
            {
                enabled: this.options.save,
                handler: new L.SaveToolbar.Save(map, {
                    featureGroup: featureGroup
                }),
                title: "Save layers"
            }
        ];
    },

    // @method addToolbar(map): L.DomUtil
    // Adds the toolbar to the map
    addToolbar: function (map) {
        var container = L.Toolbar.prototype.addToolbar.call(this, map);

        if (this.options.save) {

            this._checkDisabled();

            this.options.featureGroup.on('layeradd layerremove', this._checkDisabled, this);
        }

        return container;
    },

    _checkDisabled: function () {
        var featureGroup = this.options.featureGroup,
            hasLayers = featureGroup.getLayers().length !== 0,
            button;

        button = this._modes[L.SaveToolbar.Save.TYPE].button;

        if (hasLayers) {
            L.DomUtil.removeClass(button, 'leaflet-disabled');
        } else {
            L.DomUtil.addClass(button, 'leaflet-disabled');
        }

        button.setAttribute(
            'title',
            hasLayers ?
                "Save layers to database"
                : "No layers to save"
        );
    }
});