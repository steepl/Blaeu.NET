/**
 * class used for creating a L.SaveToolbar and adding it as a control to Leaflet
 */
L.Control.Draw.Save = L.Control.Draw.extend({

    // Options
    options: {
        position: 'topleft',
        save: true
    },

    // @method initialize(): void
    // Initializes draw control, button and toolbars from the options
    initialize: function (options) {
        if (L.version < '0.7') {
            throw new Error('Leaflet.draw 0.2.3+ requires Leaflet 0.7.0+. Download latest from https://github.com/Leaflet/Leaflet/');
        }

        L.Control.prototype.initialize.call(this, options);

        var toolbar;

        this._toolbars = {};

        if (L.SaveToolbar && this.options.save) {
            toolbar = new L.SaveToolbar(this.options.save);

            this._toolbars[L.SaveToolbar.TYPE] = toolbar;

            // Listen for when toolbar is enabled
            this._toolbars[L.SaveToolbar.TYPE].on('enable', this._toolbarEnabled, this);
        }

        L.toolbar = this; //set global var for editing the toolbar
    }
});