sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
], function (Controller, History) {
    "use strict";

    return Controller.extend("valiantlistdetail.controller.BaseController", {
       
        getRouter : function () {
            return this.getOwnerComponent().getRouter();
        },
        getModel : function (sName) {
            return this.getView().getModel(sName);
        },

        setModel : function (oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },

        getResourceBundle : function () {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },
        onNavBack : function() {
            var sPreviousHash = History.getInstance().getPreviousHash();

            if (sPreviousHash !== undefined) {
                // eslint-disable-next-line fiori-custom/sap-no-history-manipulation
                history.go(-1);
            } else {
                this.getRouter().navTo("list", {}, true);
            }
        }

    });

});