'use strict';
/*jshint esnext: true */

export
default class MainCtrl {
  constructor($scope) {
    this.scope = $scope;
    this.sizes = [10, 12, 14, 18, 20, 24, 28, 36, 48, 60, 68, 80, 100, 148];

    this.fontDropdownOpened = false;

    this.fonts = [{
      name: 'Checkpoint',
      tag: 'checkpoint'
    }, {
      name: 'Cochise',
      tag: 'cochise'
    }, {
      name: 'Kaleidoskop',
      tag: 'kaleidoskop'
    }, {
      name: 'Lifetime',
      tag: 'lifetime'
    }, {
      name: 'Olympia-Heavy',
      tag: 'olympia-heavy'
    }, {
      name: 'Olympia-MediumCond',
      tag: 'olympia-mediumcond'
    }, {
      name: 'Sunflower',
      tag: 'sunflower'
    }, {
      name: 'TabascoTwin',
      tag: 'tabascotwin'
    }, {
      name: 'Times',
      tag: 'times'
    }];

    // Wait one tick for Rangy init
    setTimeout(() => {
      this.fontSizeRemover = rangy.createCssClassApplier('\\s*fontsize_\\d{1,3}\\s*', {
        normalize: true
      });
      this.fontFamilyRemover = rangy.createCssClassApplier('\\s*fontfamily_[^_]+\\s*', {
        normalize: true
      });
      this.generateSVG();
      this.attachPasteHandler();
      this.editMode = true;
    }, 0);
  }

  toggleBold() {
    document.execCommand('bold', false, null);
  }

  toggleItalic() {
    document.execCommand('italic', false, null);
  }

  toggleEditMode() {
    this.editMode = true;
  }

  toggleSize() {
    this.fontSizeRemover.undoToSelection();
    var cssApplier = rangy.createCssClassApplier('fontsize_' + this.fontSize, {
      normalize: true
    });
    cssApplier.applyToSelection();
    this.fontSize = null;
  }

  toggleFont(family) {
    this.fontFamilyRemover.undoToSelection();
    var cssApplier = rangy.createCssClassApplier('fontfamily_' + family, {
      normalize: true
    });
    cssApplier.applyToSelection();
  }

  convertSpan(item) {
    var attrs = {};
    if (item.className) {
      var classes = item.className.split(/\s+/);
      classes.forEach(function(c) {
        var vals = c.split('_');
        attrs[vals[0]] = vals[1];
      });
    }
    attrs.text = item.innerHTML.replace(/&nbsp;/g, " ");
    return attrs;
  }

  traverseSpans(node) {
    var out = [];
    var data = $(node).children();
    data.each((index, item) => {
      if ($(item).children().length > 0) {
        var more = this.traverseSpans(item);
        if (out.length > 0) {
          out[out.length - 1].crlf = true;
        }
        out = out.concat(more);
      } else {
        var one = this.convertSpan(item);
        out.push(one);
      }
    });
    return out;
  }

  attachPasteHandler() {
    $('#editor').on('paste', function() {
      setTimeout(function() {

        // Remove nested spans
        var multispan = $("#editor span > span").parent();
        var children = multispan.children();
        multispan.replaceWith(children);

        // Remove styles
        var styles = $("#editor [style]");
        styles.each(function(idx, elm) {
          console.log(elm);
          var fam, siz;
          var span = $(elm);
          var font = span.css('font-family');
          var size = span.css('font-size');
          if (font) {
            fam = font.replace(/'/g, '').split(" ")[0].toLowerCase();
          }
          if (size) {
            siz = parseInt(size, 10);
          }
          console.log(fam);
          console.log(siz);
          span.removeAttr('style');
          span.attr('class', "fontfamily_" + fam + " fontsize_" + siz);
        });
      }, 0);
    });
  }

  generateSVG() {
    console.log(this);
    var traverse = this.traverseSpans($('#editor'));
    this.lines = [];
    var lineTemplate = {
      data: {
        visible: false,
        dy: 60
      },
      spans: []
    };
    var line = angular.copy(lineTemplate);
    traverse.forEach((elm) => {
      if (elm.text === '') {
        elm.text = '';
      }
      line.spans.push(elm);
      console.log(elm);
      if (elm.crlf) {
        this.lines.push(line);
        line = angular.copy(lineTemplate);
      }
    });
    if (line.spans.length > 0) {
      this.lines.push(line);
    }
    this.editMode = false;
    setTimeout(this.fixTspans.bind(this), 0);
  }

  fixTspans() {
    $('#svgoutput').children().each((i, el) => {
      var bbox = el.getBBox();
      if (i === 0) {
        this.lines[0].data.dy = bbox.height;
      }
      if (i > 0) {
        console.log(bbox);
        this.lines[i].data.dy = this.lines[i - 1].data.dy + bbox.height;
      }
      this.lines[i].data.visible = true;
    });
    this.scope.$apply();
    console.log(this.lines);
  }
}