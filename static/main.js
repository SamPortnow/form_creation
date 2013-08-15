$(document).ready(function()
{

    make_draggable = function(elm)
    {
        elm.draggable();
    }

    make_adjustable = function(elm)
    {
        elm.append("<input type='text' data-bind='value: myWidth' class='input-small'>");
        elm.append("<input type='text' data-bind='value: myHeight' class='input-small'>");

    }

    var ViewModel = function()
    {
        var self = this;

        this.addPart = function(data, event)
        {
            var string = event.currentTarget.textContent;
            var div = $("<div class='draggable'></div>");
            var span = $("<div class='content' data-bind='style:{ width: myWidth, height: myHeight }'></div>")
            span.get()[0].innerHTML = event.currentTarget.textContent;
            div.append(span);
            $('#parts').append(div);
            make_draggable(div);
            make_adjustable(div);
            ko.applyBindings(new ViewModel(), div.get()[0]);
        }

        this.myWidth= ko.observable('400px');
        this.myHeight = ko.observable('200px');
    }

    ko.applyBindings(new ViewModel());
})