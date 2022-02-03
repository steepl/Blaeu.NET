/**
 * class used to include L.SaveToolbar to Leaflet.draw control
 */
L.Control.Draw.Save = L.Control.Draw.include({

    // Options
    options: {
        position: 'topright',
        draw: {},
        edit: false,
        save: false
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

        // Initialize toolbars
        if (L.DrawToolbar && this.options.draw) {
            toolbar = new L.DrawToolbar(this.options.draw);

            this._toolbars[L.DrawToolbar.TYPE] = toolbar;

            // Listen for when toolbar is enabled
            this._toolbars[L.DrawToolbar.TYPE].on('enable', this._toolbarEnabled, this);
        }

        if (L.SaveToolbar && this.options.save) {
            toolbar = new L.SaveToolbar(this.options.save);

            this._toolbars[L.SaveToolbar.TYPE] = toolbar;

            // Listen for when toolbar is enabled
            this._toolbars[L.SaveToolbar.TYPE].on('enable', this._toolbarEnabled, this);
        }

        if (L.EditToolbar && this.options.edit) {
            toolbar = new L.EditToolbar(this.options.edit);

            this._toolbars[L.EditToolbar.TYPE] = toolbar;

            // Listen for when toolbar is enabled
            this._toolbars[L.EditToolbar.TYPE].on('enable', this._toolbarEnabled, this);
        }

        L.toolbar = this; //set global var for editing the toolbar
    }
});