sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/Sorter",
    "sap/ui/model/FilterOperator",
    "sap/m/GroupHeaderListItem",
    "sap/ui/Device",
    "sap/ui/core/Fragment",
    "../model/formatter"
], function (BaseController, JSONModel, Filter, Sorter, FilterOperator, GroupHeaderListItem, Device, Fragment, formatter) {
    "use strict";

    return BaseController.extend("valiantlistdetail.controller.List", {

        formatter: formatter,
        onInit : function () {
           
            const oModelView = new JSONModel();
                this.getView().setModel(oModelView, "employees");
                this.getOwnerComponent().getModel().read('/Employees', {
                    success: function(oData, response) {
                        this.getView().getModel(`employees`).setData(oData.results);
                    }.bind(this),
                    error:function(oError){

                    }.bind(this)
                });

            const oList = this.byId("list"),
                oViewModel = this._createViewModel();
  
            this._oList = oList;
            this._oListFilterState = {
                aFilter : [],
                aSearch : []
            };

            this.setModel(oViewModel, "listView");

            this.getRouter().getRoute("list").attachPatternMatched(this._onMasterMatched, this);
        },

        onUpdateFinished : function (oEvent) {
            this._updateListItemCount(oEvent.getParameter("total"));
        },

        
        onSelectionChange: function (oEvent) {
            var oList = oEvent.getSource(),
                bSelected = oEvent.getParameter("selected");
            if (!(oList.getMode() === "MultiSelect" && !bSelected)) {
                   this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
            }
        },

        onNavBack: function() {
          history.go(-1);
        },

        _createViewModel: function() {
            return new JSONModel({
                isFilterBarVisible: false,
                filterBarLabel: "",
                delay: 0,
                title: this.getResourceBundle().getText("listTitleCount", [0]),
                noDataText: this.getResourceBundle().getText("listListNoDataText"),
                sortBy: "EmployeeID",
                groupBy: "None"
            });
        },

        _onMasterMatched:  function() {
            //Set the layout property of the FCL control to 'OneColumn'
            this.getModel("appView").setProperty("/layout", "OneColumn");
        },
        _showDetail: function (oItem) {
            var bReplace = !Device.system.phone;
            // set the layout property of FCL control to show two columns
            this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
            this.getRouter().navTo("object", {
                objectId : oItem.getBindingContext(`employees`).getProperty(`EmployeeID`)
            }, bReplace);
        },
        _updateListItemCount: function (iTotalItems) {
            var sTitle;
            // only update the counter if the length is final
            if (this._oList.getBinding("items").isLengthFinal()) {
                sTitle = this.getResourceBundle().getText("listTitleCount", [iTotalItems]);
                this.getModel("listView").setProperty("/title", sTitle);
            }
        },
        _applyFilterSearch: function () {
            var aFilters = this._oListFilterState.aSearch.concat(this._oListFilterState.aFilter),
                oViewModel = this.getModel("listView");
            this._oList.getBinding("items").filter(aFilters, "Application");
            // changes the noDataText of the list in case there are no filter results
            if (aFilters.length !== 0) {
                oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("listListNoDataWithFilterOrSearchText"));
            } else if (this._oListFilterState.aSearch.length > 0) {
                // only reset the no data text to default when no new search was triggered
                oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("listListNoDataText"));
            }
        },

        _updateFilterBar : function (sFilterBarText) {
            var oViewModel = this.getModel("listView");
            oViewModel.setProperty("/isFilterBarVisible", (this._oListFilterState.aFilter.length > 0));
            oViewModel.setProperty("/filterBarLabel", this.getResourceBundle().getText("listFilterBarText", [sFilterBarText]));
        }

    });

});