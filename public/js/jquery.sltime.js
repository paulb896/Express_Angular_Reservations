(function ($) {
    var methods = {
        init: function (options) {
            var defaultSettings = {
                format: '24'
            };
            var settings = $.extend(defaultSettings, options);
            return this.each(function (index) {
                var current_input = this;
                var wrap_time = $("<div class='slwrp_time'><div class='h24'><div class='f24'>24h</div><div class='f12'>12h</div></div><div class='btn_ok'></div><div class='wrp_time'><span class='current_time'></span></div><div class='sltime'><div class='slminutes'></div><div class='slhours'></div></div></div>").appendTo($("body"));
                switch (settings.format) {
                    case '12':
                    {
                        $(".h24 .f12", wrap_time).addClass("active")
                    };
                        break;
                    default:
                    {
                        $(".h24 .f24", wrap_time).addClass("active")
                    };
                        break
                };
                $(".h24 div", wrap_time).bind("click", function () {
                    $(".h24 div", wrap_time).removeClass("active");
                    $(this).addClass("active");
                    switch ($(this).html()) {
                        case '12h':
                        {
                            settings.format = '12'
                        };
                            break;
                        default:
                        {
                            settings.format = '24'
                        };
                            break
                    };
                    methods.set($(".sltime", wrap_time).data("time_h"), 24, $(".active_hours", wrap_time), $(".slhours", wrap_time), 14, wrap_time, settings)
                });
                methods.new_object($(".slminutes", wrap_time), 0, 60, "active_minuts", 5, wrap_time, settings);
                methods.new_object($(".slhours", wrap_time), 0, 24, "active_hours", 14, wrap_time, settings);
                $(".active_minuts", wrap_time).bind("drag", function (e) {
                    var offset_cl = $(".slminutes", wrap_time);
                    var alpha = methods.calc_alpha(e, offset_cl);
                    methods.set(alpha / 6, 60, $(".active_minuts", wrap_time), $(".sltime", wrap_time), 5, wrap_time, settings)
                });
                $(".active_hours", wrap_time).bind("drag", function (e) {
                    var offset_cl = $(".slhours", wrap_time);
                    var alpha = methods.calc_alpha(e, offset_cl);
                    methods.set(alpha / 15, 24, $(".active_hours", wrap_time), $(".slhours", wrap_time), 14, wrap_time, settings)
                });
                $(".slminutes", wrap_time).bind("click", function (e) {
                    var offset_cl = $(".slminutes", wrap_time);
                    var alpha = methods.calc_alpha(e, offset_cl);
                    methods.set(alpha / 6, 60, $(".active_minuts", wrap_time), $(".sltime", wrap_time), 5, wrap_time, settings)
                });
                $(".slhours", wrap_time).bind("click", function (e) {
                    var offset_cl = $(".slhours", wrap_time);
                    var alpha = methods.calc_alpha(e, offset_cl);
                    methods.set(alpha / 15, 24, $(".active_hours", wrap_time), $(".slhours", wrap_time), 14, wrap_time, settings)
                });
                $(".btn_ok", wrap_time).bind("click", function () {
                    $(wrap_time).fadeOut();
                    $(current_input).val($(".current_time", wrap_time).html())
                });
                $(document).bind('click', function (e) {
                    if ($(wrap_time).find(e.target).size() == 0 & current_input != e.target & $(wrap_time).css('display') != 'none') {
                        $(wrap_time).fadeOut();
                        $(current_input).val($(".current_time", wrap_time).html())
                    }
                });
                $(current_input).bind("click", function (e) {
                    methods.show(this, wrap_time, settings)
                })
            })
        },
        show: function (object, wrap_time, settings) {
            if ($(wrap_time).css("display") == 'none') {
                $(wrap_time).css({
                    'top': $(object).offset().top + $(object).height() + 10,
                    'left': $(object).offset().left - parseInt(Math.abs($(object).width() - $("#slwrp_time").width()) / 4)
                });
                $(wrap_time).fadeIn();
                methods.update_time($(object).val(), wrap_time, settings)
            } else {
                $(wrap_time).fadeOut();
                $(object).val($(".current_time", wrap_time).html())
            }
        },
        calc_alpha: function (mouse_handler, container) {
            var cur_x = mouse_handler.pageX - container.offset().left;
            var cur_y = mouse_handler.pageY - container.offset().top;
            var height = container.height() / 2;
            var alpha = parseInt(Math.atan((cur_y - height) / (cur_x - height)) * (180 / Math.PI));
            if ((cur_x - height >= 0) && (cur_y - height <= 0)) {
                alpha = 90 + alpha
            } else if ((cur_x - height >= 0) && (cur_y - height > 0)) {
                alpha = 90 + alpha
            } else if ((cur_x - height < 0) && (cur_y - height > 0)) {
                alpha = 270 + alpha
            } else if ((cur_x - height < 0) && (cur_y - height <= 0)) {
                alpha = 270 + alpha
            };
            return alpha
        },
        set: function (value, count, object, container, dx, wrap_time, settings) {
            var coords = methods.calc_pos(value, count, container.height() / 2, object.height() / 2, dx);
            object.css({
                'top': coords.y,
                'left': coords.x
            });
            value = parseInt(value);
            switch (count) {
                case 24:
                {
                    $(".sltime", wrap_time).data("time_h", value);
                    switch (settings.format) {
                        case '12':
                        {
                            var hours = $(".sltime", wrap_time).data("time_h");
                            if (parseInt(hours) < 12) {
                                if (parseInt(hours * 1) == 0) {
                                    object.html(12);
                                    $(".current_time", wrap_time).html(12 + ':' + $(".sltime", wrap_time).data("time_m") + ' am')
                                } else {
                                    object.html(value);
                                    $(".current_time", wrap_time).html(hours + ':' + $(".sltime", wrap_time).data("time_m") + ' am')
                                }
                            } else {
                                var hour_half = hours % 12;
                                if (parseInt(hours * 1) == 12) {
                                    object.html(hours);
                                    $(".current_time", wrap_time).html(hours + ':' + $(".sltime", wrap_time).data("time_m") + ' pm')
                                } else {
                                    object.html(hour_half);
                                    $(".current_time", wrap_time).html(hour_half + ':' + $(".sltime", wrap_time).data("time_m") + ' pm')
                                }
                            }
                        };
                            break;
                        default:
                        {
                            if (parseInt(value) < 10) {
                                value = "0".concat(value)
                            };
                            object.html(value);
                            $(".current_time", wrap_time).html(value + ':' + $(".sltime", wrap_time).data("time_m"))
                        };
                            break
                    }
                };
                    break;
                case 60:
                {
                    var hours = $(".sltime", wrap_time).data("time_h");
                    switch (settings.format) {
                        case '12':
                        {
                            if (parseInt(value) < 10) {
                                value = "0".concat(value)
                            };
                            $(".sltime", wrap_time).data("time_m", value);
                            object.html(value);
                            if (hours > 11) {
                                hours = methods.format(hours);
                                $(".current_time", wrap_time).html(hours + ':' + $(".sltime", wrap_time).data("time_m") + ' pm')
                            } else {
                                hours = methods.format(hours);
                                $(".current_time", wrap_time).html(hours + ':' + $(".sltime", wrap_time).data("time_m") + ' am')
                            }
                        };
                            break;
                        default:
                        {
                            if (parseInt(value) < 10) {
                                value = "0".concat(value)
                            };
                            $(".sltime", wrap_time).data("time_m", value);
                            object.html(value);
                            if (hours > 11) {
                                if (parseInt(hours) < 10) {
                                    hours = "0".concat(hours)
                                };
                                $(".current_time", wrap_time).html(hours + ':' + $(".sltime", wrap_time).data("time_m"))
                            } else {
                                if (parseInt(hours) < 10) {
                                    hours = "0".concat(hours)
                                };
                                $(".current_time", wrap_time).html(hours + ':' + $(".sltime", wrap_time).data("time_m"))
                            }
                        };
                            break
                    }
                };
                    break
            }
            if (object[0].className == "active_minuts") {
                console.log("Changing minutes", object[0].textContent);
                $(document).trigger("update-min", object[0].textContent);
            } else {
                console.log("Changing hours", object[0].textContent);
                $(document).trigger("update-hour", object[0].textContent);
            }
        },
        new_object: function (container, alpha, count, class_name, dx, wrap_time, settings) {
            var object = $("<div class='" + class_name + "'></div>").appendTo(container);
            methods.set(alpha, count, object, container, dx, wrap_time, settings);
            alpha = parseInt(alpha);
            if (parseInt(alpha) < 10) {
                alpha = "0".concat(alpha)
            };
            object.html(alpha)
        },
        calc_pos: function (value, count, radius_big, radius_child, dx) {
            var pos = new Object;
            pos.x = radius_big + Math.sin((2 * Math.PI / count) * value) * (radius_big - radius_child - dx) - (radius_child);
            pos.y = radius_big - Math.cos((2 * Math.PI / count) * value) * (radius_big - radius_child - dx) - (radius_child);
            return pos
        },
        format: function (value) {
            if (value < 12) {
                if (value == 0) {
                    value = 12
                }
            } else {
                if (value != 12) {
                    value = value % 12
                }
            };
            return value
        },
        update_time: function (str, wrap_time, settings) {
            switch (settings.format) {
                case '12':
                {
                    var arr_time = str.split(':');
                    if (arr_time.length > 1) {
                        var min = (arr_time[1]);
                        var hr = (arr_time[0] * 1);
                        var ar_min = min.split(' ');
                        min = ar_min[0] * 1;
                        var time_of_day = ar_min[1].trim();
                        switch (time_of_day) {
                            case 'pm':
                            {
                                if (hr != 12) {
                                    hr = 12 + hr
                                }
                            };
                                break;
                            default:
                            {
                                if (hr == 12) {
                                    hr = 0
                                }
                            };
                                break
                        };
                        methods.set(min, 60, $(".active_minuts", wrap_time), $(".sltime", wrap_time), 5, wrap_time, settings);
                        methods.set(hr, 24, $(".active_hours", wrap_time), $(".slhours", wrap_time), 14, wrap_time, settings)
                    } else {
                        methods.set(0, 60, $(".active_minuts", wrap_time), $(".sltime", wrap_time), 5, wrap_time, settings);
                        methods.set(0, 24, $(".active_hours", wrap_time), $(".slhours", wrap_time), 14, wrap_time, settings)
                    }
                };
                    break;
                default:
                {
                    var arr_time = str.split(':');
                    if (arr_time.length > 1) {
                        var min = (arr_time[1] * 1);
                        var hr = (arr_time[0] * 1);
                        methods.set(min, 60, $(".active_minuts", wrap_time), $(".sltime", wrap_time), 5, wrap_time, settings);
                        methods.set(hr, 24, $(".active_hours", wrap_time), $(".slhours", wrap_time), 14, wrap_time, settings)
                    } else {
                        methods.set(0, 60, $(".active_minuts", wrap_time), $(".sltime", wrap_time), 5, wrap_time, settings);
                        methods.set(0, 24, $(".active_hours", wrap_time), $(".slhours", wrap_time), 14, wrap_time, settings)
                    }
                };
                    break
            }
        }
    };
    $.fn.sltime = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1))
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments)
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.circle.timepicker')
        }
    }
})(jQuery);