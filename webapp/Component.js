sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "./model/models",
    "./controller/ListSelector",
    "./controller/ErrorHandler"
], 
function (UIComponent, Device, models, ListSelector, ErrorHandler) {
    "use strict";

    return UIComponent.extend("valiantlistdetail.Component", {
       
        metadata : {
            manifest : "json"
        },

        init : function () {
            this.oListSelector = new ListSelector();
            this._oErrorHandler = new ErrorHandler(this);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // call the base component's init function and create the App view
            UIComponent.prototype.init.apply(this, arguments);

            // create the views based on the url/hash
            this.getRouter().initialize();
        },

        destroy : function () {
            this.oListSelector.destroy();
            this._oErrorHandler.destroy();
            // call the base component's destroy function
            UIComponent.prototype.destroy.apply(this, arguments);
        },

        getContentDensityClass : function() {
            if (this._sContentDensityClass === undefined) {
                // check whether FLP has already set the content density class; do nothing in this case
                // eslint-disable-next-line fiori-custom/sap-no-proprietary-browser-api, fiori-custom/sap-browser-api-warning
                if (document.body.classList.contains("sapUiSizeCozy") || document.body.classList.contains("sapUiSizeCompact")) {
                    this._sContentDensityClass = "";
                } else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
                    this._sContentDensityClass = "sapUiSizeCompact";
                } else {
                    // "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
                    this._sContentDensityClass = "sapUiSizeCozy";
                }
            }
            return this._sContentDensityClass;
        }

    });
});