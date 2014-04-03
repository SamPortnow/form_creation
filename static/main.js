$(document).ready(function()
{
//custom binding to initialize a jQuery UI dialog
ko.bindingHandlers.dialog = {
    init: function(element, valueAccessor) {
        var options = ko.utils.unwrapObservable(valueAccessor()) || {};

        //handle disposal
        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
            $(element).dialog("destroy");
        });

        //dialog is moved to the bottom of the page by jQuery UI. Prevent initial pass of ko.applyBindings from hitting it
        setTimeout(function() {
            $(element).dialog(options);
        }, 0);
    }
};

//custom binding handler that opens/closes the dialog
ko.bindingHandlers.openDialog = {
    update: function(element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        if (value) {
            $(element).dialog("open");
        } else {
            $(element).dialog("close");
        }
    }
}

//custom binding to initialize a jQuery UI button
ko.bindingHandlers.jqButton = {
    init: function(element, valueAccessor) {
        var options = ko.utils.unwrapObservable(valueAccessor()) || {};

        //handle disposal
        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
            $(element).button("destroy");
        });

        $(element).button(options);
    }
};

var Part = function(options, isNew) {

    this.isNew = isNew;

    for (parameter in options)
    {
        this[parameter] = ko.observable(options[parameter]);
        this["edit"+parameter] = ko.observable(options[parameter]);
    }

    //persist edits to real values on accept
    this.accept = function() {
        for (parameter in options)
        {
            this[parameter](this["edit"+parameter]());
        }
    }.bind(this);

    //reset to originals on cancel
    this.cancel = function() {

        for (parameter in options)
        {
            this["edit"+parameter](this[parameter]());
        }
    }.bind(this);

}


var ViewModel = function() {
    var self = this;
    var options;
    var typeArea;

    this.sectionList = ko.observableArray([
    ]);

    this.partList = ko.observableArray([
    ]);

    this.listEls = ko.observableArray([
    ]);

    this.partText = ko.observableArray([
    ]);

    this.selectedPart = ko.observable();
    this.editPart = function(PartToEdit)
    {
        console.log(PartToEdit);
        self.selectedPart(PartToEdit);
    };

    this.addPart = function(data, event) {
        typeArea = $.trim(event.currentTarget.textContent);
            $('#editPart').html($('#textTemplate').html());
            options = {
                text: "",
                width: "",
                height: "",
                fontSize: ""
            }

        self.selectedPart(new Part(options, true));
        $('.fonts').fontselect();
    },

        this.addOrderedList = function(data, event)
    {
        typeArea = $.trim(event.currentTarget.textContent);
        $('#editPart').html($('#listTemplate').html());
        options = {
            width: "",
            height: "",
            numberElements: ""
        }

        self.selectedPart(new Part(options, true));
    },


    this.removePart = function(Part) {
        self.partList.remove(Part);
    },

    this.accept = function() {
        var selected = self.selectedPart();
        selected.accept();
        var selected_options = {};
        if (selected.isNew)
        {
            for (selection in options)
            {
                selected_options[selection] = selected[selection]();
            }
            if (typeArea == 'text')
            {
               self.partText.push(new Part(selected_options));
            }
            else if (typeArea == 'list')
            {
               self.listEls.push(new Part(selected_options));
            }
            $(".part").resizable();
            $(".part").draggable({
                drag: function(event, ui)
                {
                    if ($(this).parent().attr('class') != 'text text-center')
                    {
                        $(this).detach()
                        $('.text').append(this);
                    }
                }
            });
            $(".part").droppable({
                hoverClass: "ui-state-highlight",
                drop: function(event, ui)
                {
                    $(this).append($(ui.draggable));
                }

            });
        }
    }
    this.cancel = function() {
        self.selectedPart().cancel();
        self.selectedPart("");
    }
};

ko.applyBindings(new ViewModel());

});
