{
    BSOMetaParser = objectThatDelegatesTo(Parser, {
        "fromTo": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                x, y;
            return (function() {
                x = this._apply("anything");
                y = this._apply("anything");
                this._applyWithArgs("seq", x);
                this._many((function() {
                    return (function() {
                        this._not((function() {
                            return this._applyWithArgs("seq", y)
                        }));
                        return this._apply("char")
                    }).call(this)
                }));
                return this._applyWithArgs("seq", y)
            }).call(this)
        },
        "space": function() {
            var $elf = this,
                _fromIdx = this.input.idx;
            return this._or((function() {
                return Parser._superApplyWithArgs(this, 'space')
            }), (function() {
                return this._applyWithArgs("fromTo", "//", "\n")
            }), (function() {
                return this._applyWithArgs("fromTo", "/*", "*/")
            }))
        },
        "nameFirst": function() {
            var $elf = this,
                _fromIdx = this.input.idx;
            return this._or((function() {
                return (function() {
                    switch (this._apply('anything')) {
                        case "_":
                            return "_";
                        case "$":
                            return "$";
                        default:
                            throw fail
                    }
                }).call(this)
            }), (function() {
                return this._apply("letter")
            }))
        },
        "nameRest": function() {
            var $elf = this,
                _fromIdx = this.input.idx;
            return this._or((function() {
                return this._apply("nameFirst")
            }), (function() {
                return this._apply("digit")
            }))
        },
        "tsName": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                xs;
            return (function() {
                xs = this._applyWithArgs("firstAndRest", "nameFirst", "nameRest");
                return xs.join("")
            }).call(this)
        },
        "name": function() {
            var $elf = this,
                _fromIdx = this.input.idx;
            return (function() {
                this._apply("spaces");
                return this._apply("tsName")
            }).call(this)
        },
        "eChar": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                c;
            return this._or((function() {
                return (function() {
                    switch (this._apply('anything')) {
                        case "\\":
                            return (function() {
                                c = this._apply("char");
                                return unescape(("\\" + c))
                            }).call(this);
                        default:
                            throw fail
                    }
                }).call(this)
            }), (function() {
                return this._apply("char")
            }))
        },
        "tsString": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                xs;
            return (function() {
                this._applyWithArgs("exactly", "\'");
                xs = this._many((function() {
                    return (function() {
                        this._not((function() {
                            return this._applyWithArgs("exactly", "\'")
                        }));
                        return this._apply("eChar")
                    }).call(this)
                }));
                this._applyWithArgs("exactly", "\'");
                return xs.join("")
            }).call(this)
        },
        "characters": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                xs;
            return (function() {
                this._applyWithArgs("exactly", "`");
                this._applyWithArgs("exactly", "`");
                xs = this._many((function() {
                    return (function() {
                        this._not((function() {
                            return (function() {
                                this._applyWithArgs("exactly", "\'");
                                return this._applyWithArgs("exactly", "\'")
                            }).call(this)
                        }));
                        return this._apply("eChar")
                    }).call(this)
                }));
                this._applyWithArgs("exactly", "\'");
                this._applyWithArgs("exactly", "\'");
                return ["App", "seq", xs.join("").toProgramString()]
            }).call(this)
        },
        "sCharacters": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                xs;
            return (function() {
                this._applyWithArgs("exactly", "\"");
                xs = this._many((function() {
                    return (function() {
                        this._not((function() {
                            return this._applyWithArgs("exactly", "\"")
                        }));
                        return this._apply("eChar")
                    }).call(this)
                }));
                this._applyWithArgs("exactly", "\"");
                return ["App", "token", xs.join("").toProgramString()]
            }).call(this)
        },
        "string": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                xs;
            return (function() {
                xs = this._or((function() {
                    return (function() {
                        (function() {
                            switch (this._apply('anything')) {
                                case "#":
                                    return "#";
                                case "`":
                                    return "`";
                                default:
                                    throw fail
                            }
                        }).call(this);
                        return this._apply("tsName")
                    }).call(this)
                }), (function() {
                    return this._apply("tsString")
                }));
                return ["App", "exactly", xs.toProgramString()]
            }).call(this)
        },
        "number": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                sign, ds;
            return (function() {
                sign = this._or((function() {
                    return (function() {
                        switch (this._apply('anything')) {
                            case "-":
                                return "-";
                            default:
                                throw fail
                        }
                    }).call(this)
                }), (function() {
                    return (function() {
                        this._apply("empty");
                        return ""
                    }).call(this)
                }));
                ds = this._many1((function() {
                    return this._apply("digit")
                }));
                return ["App", "exactly", (sign + ds.join(""))]
            }).call(this)
        },
        "keyword": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                xs;
            return (function() {
                xs = this._apply("anything");
                this._applyWithArgs("token", xs);
                this._not((function() {
                    return this._apply("letterOrDigit")
                }));
                return xs
            }).call(this)
        },
        "args": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                xs;
            return this._or((function() {
                return (function() {
                    switch (this._apply('anything')) {
                        case "(":
                            return (function() {
                                xs = this._applyWithArgs("listOf", "hostExpr", ",");
                                this._applyWithArgs("token", ")");
                                return xs
                            }).call(this);
                        default:
                            throw fail
                    }
                }).call(this)
            }), (function() {
                return (function() {
                    this._apply("empty");
                    return []
                }).call(this)
            }))
        },
        "application": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                rule, as, grm, rule, as, rule, as;
            return this._or((function() {
                return (function() {
                    this._applyWithArgs("token", "^");
                    rule = this._apply("name");
                    as = this._apply("args");
                    return ["App", "super", (("\'" + rule) + "\'")].concat(as)
                }).call(this)
            }), (function() {
                return (function() {
                    grm = this._apply("name");
                    this._applyWithArgs("token", ".");
                    rule = this._apply("name");
                    as = this._apply("args");
                    return ["App", "foreign", grm, (("\'" + rule) + "\'")].concat(as)
                }).call(this)
            }), (function() {
                return (function() {
                    rule = this._apply("name");
                    as = this._apply("args");
                    return ["App", rule].concat(as)
                }).call(this)
            }))
        },
        "hostExpr": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                r;
            return (function() {
                r = this._applyWithArgs("foreign", BSSemActionParser, 'expr');
                return this._applyWithArgs("foreign", BSJSTranslator, 'trans', r)
            }).call(this)
        },
        "curlyHostExpr": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                r;
            return (function() {
                r = this._applyWithArgs("foreign", BSSemActionParser, 'curlySemAction');
                return this._applyWithArgs("foreign", BSJSTranslator, 'trans', r)
            }).call(this)
        },
        "primHostExpr": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                r;
            return (function() {
                r = this._applyWithArgs("foreign", BSSemActionParser, 'semAction');
                return this._applyWithArgs("foreign", BSJSTranslator, 'trans', r)
            }).call(this)
        },
        "atomicHostExpr": function() {
            var $elf = this,
                _fromIdx = this.input.idx;
            return this._or((function() {
                return this._apply("curlyHostExpr")
            }), (function() {
                return this._apply("primHostExpr")
            }))
        },
        "semAction": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                x, x;
            return this._or((function() {
                return (function() {
                    x = this._apply("curlyHostExpr");
                    return ["Act", x]
                }).call(this)
            }), (function() {
                return (function() {
                    this._applyWithArgs("token", "!");
                    x = this._apply("atomicHostExpr");
                    return ["Act", x]
                }).call(this)
            }))
        },
        "arrSemAction": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                x;
            return (function() {
                this._applyWithArgs("token", "->");
                x = this._apply("atomicHostExpr");
                return ["Act", x]
            }).call(this)
        },
        "semPred": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                x;
            return (function() {
                this._applyWithArgs("token", "?");
                x = this._apply("atomicHostExpr");
                return ["Pred", x]
            }).call(this)
        },
        "expr": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                x, xs, x, xs;
            return this._or((function() {
                return (function() {
                    x = this._applyWithArgs("expr5", true);
                    xs = this._many1((function() {
                        return (function() {
                            this._applyWithArgs("token", "|");
                            return this._applyWithArgs("expr5", true)
                        }).call(this)
                    }));
                    return ["Or", x].concat(xs)
                }).call(this)
            }), (function() {
                return (function() {
                    x = this._applyWithArgs("expr5", true);
                    xs = this._many1((function() {
                        return (function() {
                            this._applyWithArgs("token", "||");
                            return this._applyWithArgs("expr5", true)
                        }).call(this)
                    }));
                    return ["XOr", x].concat(xs)
                }).call(this)
            }), (function() {
                return this._applyWithArgs("expr5", false)
            }))
        },
        "expr5": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                ne, x, xs;
            return (function() {
                ne = this._apply("anything");
                return this._or((function() {
                    return (function() {
                        x = this._apply("interleavePart");
                        xs = this._many1((function() {
                            return (function() {
                                this._applyWithArgs("token", "&&");
                                return this._apply("interleavePart")
                            }).call(this)
                        }));
                        return ["Interleave", x].concat(xs)
                    }).call(this)
                }), (function() {
                    return this._applyWithArgs("expr4", ne)
                }))
            }).call(this)
        },
        "interleavePart": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                part, part;
            return this._or((function() {
                return (function() {
                    this._applyWithArgs("token", "(");
                    part = this._applyWithArgs("expr4", true);
                    this._applyWithArgs("token", ")");
                    return ["1", part]
                }).call(this)
            }), (function() {
                return (function() {
                    part = this._applyWithArgs("expr4", true);
                    return this._applyWithArgs("modedIPart", part)
                }).call(this)
            }))
        },
        "modedIPart": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                part, part, part, part;
            return this._or((function() {
                return (function() {
                    this._form((function() {
                        return (function() {
                            this._applyWithArgs("exactly", "And");
                            return this._form((function() {
                                return (function() {
                                    this._applyWithArgs("exactly", "Many");
                                    return part = this._apply("anything")
                                }).call(this)
                            }))
                        }).call(this)
                    }));
                    return ["*", part]
                }).call(this)
            }), (function() {
                return (function() {
                    this._form((function() {
                        return (function() {
                            this._applyWithArgs("exactly", "And");
                            return this._form((function() {
                                return (function() {
                                    this._applyWithArgs("exactly", "Many1");
                                    return part = this._apply("anything")
                                }).call(this)
                            }))
                        }).call(this)
                    }));
                    return ["+", part]
                }).call(this)
            }), (function() {
                return (function() {
                    this._form((function() {
                        return (function() {
                            this._applyWithArgs("exactly", "And");
                            return this._form((function() {
                                return (function() {
                                    this._applyWithArgs("exactly", "Opt");
                                    return part = this._apply("anything")
                                }).call(this)
                            }))
                        }).call(this)
                    }));
                    return ["?", part]
                }).call(this)
            }), (function() {
                return (function() {
                    part = this._apply("anything");
                    return ["1", part]
                }).call(this)
            }))
        },
        "expr4": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                ne, xs, act, xs, xs;
            return (function() {
                ne = this._apply("anything");
                return this._or((function() {
                    return (function() {
                        xs = this._many((function() {
                            return this._apply("expr3")
                        }));
                        act = this._apply("arrSemAction");
                        return ["And"].concat(xs).concat([act])
                    }).call(this)
                }), (function() {
                    return (function() {
                        this._pred(ne);
                        xs = this._many1((function() {
                            return this._apply("expr3")
                        }));
                        return ["And"].concat(xs)
                    }).call(this)
                }), (function() {
                    return (function() {
                        this._pred((ne == false));
                        xs = this._many((function() {
                            return this._apply("expr3")
                        }));
                        return ["And"].concat(xs)
                    }).call(this)
                }))
            }).call(this)
        },
        "optIter": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                x;
            return (function() {
                x = this._apply("anything");
                return this._or((function() {
                    return (function() {
                        switch (this._apply('anything')) {
                            case "*":
                                return ["Many", x];
                            case "+":
                                return ["Many1", x];
                            case "?":
                                return ["Opt", x];
                            default:
                                throw fail
                        }
                    }).call(this)
                }), (function() {
                    return (function() {
                        this._apply("empty");
                        return x
                    }).call(this)
                }))
            }).call(this)
        },
        "optBind": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                x, n;
            return (function() {
                x = this._apply("anything");
                return this._or((function() {
                    return (function() {
                        switch (this._apply('anything')) {
                            case ":":
                                return (function() {
                                    n = this._apply("name");
                                    return (function() {
                                        this["locals"].push(n);
                                        return ["Set", n, x]
                                    }).call(this)
                                }).call(this);
                            default:
                                throw fail
                        }
                    }).call(this)
                }), (function() {
                    return (function() {
                        this._apply("empty");
                        return x
                    }).call(this)
                }))
            }).call(this)
        },
        "expr3": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                n, x, e;
            return this._or((function() {
                return (function() {
                    this._applyWithArgs("token", ":");
                    n = this._apply("name");
                    return (function() {
                        this["locals"].push(n);
                        return ["Set", n, ["App", "anything"]]
                    }).call(this)
                }).call(this)
            }), (function() {
                return (function() {
                    e = this._or((function() {
                        return (function() {
                            x = this._apply("expr2");
                            return this._applyWithArgs("optIter", x)
                        }).call(this)
                    }), (function() {
                        return this._apply("semAction")
                    }));
                    return this._applyWithArgs("optBind", e)
                }).call(this)
            }), (function() {
                return this._apply("semPred")
            }))
        },
        "expr2": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                x, x;
            return this._or((function() {
                return (function() {
                    this._applyWithArgs("token", "~");
                    x = this._apply("expr2");
                    return ["Not", x]
                }).call(this)
            }), (function() {
                return (function() {
                    this._applyWithArgs("token", "&");
                    x = this._apply("expr1");
                    return ["Lookahead", x]
                }).call(this)
            }), (function() {
                return this._apply("expr1")
            }))
        },
        "expr1": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                x, x, x, x, x;
            return this._or((function() {
                return this._apply("application")
            }), (function() {
                return (function() {
                    x = this._or((function() {
                        return this._applyWithArgs("keyword", "undefined")
                    }), (function() {
                        return this._applyWithArgs("keyword", "nil")
                    }), (function() {
                        return this._applyWithArgs("keyword", "true")
                    }), (function() {
                        return this._applyWithArgs("keyword", "false")
                    }));
                    return ["App", "exactly", x]
                }).call(this)
            }), (function() {
                return (function() {
                    this._apply("spaces");
                    return this._or((function() {
                        return this._apply("characters")
                    }), (function() {
                        return this._apply("sCharacters")
                    }), (function() {
                        return this._apply("string")
                    }), (function() {
                        return this._apply("number")
                    }))
                }).call(this)
            }), (function() {
                return (function() {
                    this._applyWithArgs("token", "[");
                    x = this._apply("expr");
                    this._applyWithArgs("token", "]");
                    return ["Form", x]
                }).call(this)
            }), (function() {
                return (function() {
                    this._applyWithArgs("token", "<");
                    x = this._apply("expr");
                    this._applyWithArgs("token", ">");
                    return ["ConsBy", x]
                }).call(this)
            }), (function() {
                return (function() {
                    this._applyWithArgs("token", "@<");
                    x = this._apply("expr");
                    this._applyWithArgs("token", ">");
                    return ["IdxConsBy", x]
                }).call(this)
            }), (function() {
                return (function() {
                    this._applyWithArgs("token", "(");
                    x = this._apply("expr");
                    this._applyWithArgs("token", ")");
                    return x
                }).call(this)
            }))
        },
        "ruleName": function() {
            var $elf = this,
                _fromIdx = this.input.idx;
            return this._or((function() {
                return this._apply("name")
            }), (function() {
                return (function() {
                    this._apply("spaces");
                    return this._apply("tsString")
                }).call(this)
            }))
        },
        "rule": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                n, x, xs;
            return (function() {
                this._lookahead((function() {
                    return n = this._apply("ruleName")
                }));
                (this["locals"] = ["$elf=this", "_fromIdx=this.input.idx"]);
                x = this._applyWithArgs("rulePart", n);
                xs = this._many((function() {
                    return (function() {
                        this._applyWithArgs("token", ",");
                        return this._applyWithArgs("rulePart", n)
                    }).call(this)
                }));
                return ["Rule", n, this["locals"], ["Or", x].concat(xs)]
            }).call(this)
        },
        "rulePart": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                rn, n, b1, b2;
            return (function() {
                rn = this._apply("anything");
                n = this._apply("ruleName");
                this._pred((n == rn));
                b1 = this._apply("expr4");
                return this._or((function() {
                    return (function() {
                        this._applyWithArgs("token", "=");
                        b2 = this._apply("expr");
                        return ["And", b1, b2]
                    }).call(this)
                }), (function() {
                    return (function() {
                        this._apply("empty");
                        return b1
                    }).call(this)
                }))
            }).call(this)
        },
        "grammar": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                n, sn, rs;
            return (function() {
                this._applyWithArgs("keyword", "ometa");
                n = this._apply("name");
                sn = this._or((function() {
                    return (function() {
                        this._applyWithArgs("token", "<:");
                        return this._apply("name")
                    }).call(this)
                }), (function() {
                    return (function() {
                        this._apply("empty");
                        return "OMeta"
                    }).call(this)
                }));
                this._applyWithArgs("token", "{");
                rs = this._applyWithArgs("listOf", "rule", ",");
                this._applyWithArgs("token", "}");
                return this._applyWithArgs("foreign", BSOMetaOptimizer, 'optimizeGrammar', ["Grammar", n, sn].concat(rs))
            }).call(this)
        }
    });
    BSOMetaTranslator = objectThatDelegatesTo(OMeta, {
        "App": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                args, rule, args, rule;
            return this._or((function() {
                return (function() {
                    switch (this._apply('anything')) {
                        case "super":
                            return (function() {
                                args = this._many1((function() {
                                    return this._apply("anything")
                                }));
                                return [this["sName"], "._superApplyWithArgs(this,", args.join(","), ")"].join("")
                            }).call(this);
                        default:
                            throw fail
                    }
                }).call(this)
            }), (function() {
                return (function() {
                    rule = this._apply("anything");
                    args = this._many1((function() {
                        return this._apply("anything")
                    }));
                    return ["this._applyWithArgs(\"", rule, "\",", args.join(","), ")"].join("")
                }).call(this)
            }), (function() {
                return (function() {
                    rule = this._apply("anything");
                    return ["this._apply(\"", rule, "\")"].join("")
                }).call(this)
            }))
        },
        "Act": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                expr;
            return (function() {
                expr = this._apply("anything");
                return expr
            }).call(this)
        },
        "Pred": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                expr;
            return (function() {
                expr = this._apply("anything");
                return ["this._pred(", expr, ")"].join("")
            }).call(this)
        },
        "Or": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                xs;
            return (function() {
                xs = this._many((function() {
                    return this._apply("transFn")
                }));
                return ["this._or(", xs.join(","), ")"].join("")
            }).call(this)
        },
        "XOr": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                xs;
            return (function() {
                xs = this._many((function() {
                    return this._apply("transFn")
                }));
                xs.unshift(((this["name"] + ".") + this["rName"]).toProgramString());
                return ["this._xor(", xs.join(","), ")"].join("")
            }).call(this)
        },
        "And": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                xs, y;
            return this._or((function() {
                return (function() {
                    xs = this._many((function() {
                        return this._applyWithArgs("notLast", "trans")
                    }));
                    y = this._apply("trans");
                    xs.push(("return " + y));
                    return ["(function(){", xs.join(";"), "}).call(this)"].join("")
                }).call(this)
            }), (function() {
                return "undefined"
            }))
        },
        "Opt": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                x;
            return (function() {
                x = this._apply("transFn");
                return ["this._opt(", x, ")"].join("")
            }).call(this)
        },
        "Many": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                x;
            return (function() {
                x = this._apply("transFn");
                return ["this._many(", x, ")"].join("")
            }).call(this)
        },
        "Many1": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                x;
            return (function() {
                x = this._apply("transFn");
                return ["this._many1(", x, ")"].join("")
            }).call(this)
        },
        "Set": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                n, v;
            return (function() {
                n = this._apply("anything");
                v = this._apply("trans");
                return [n, "=", v].join("")
            }).call(this)
        },
        "Not": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                x;
            return (function() {
                x = this._apply("transFn");
                return ["this._not(", x, ")"].join("")
            }).call(this)
        },
        "Lookahead": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                x;
            return (function() {
                x = this._apply("transFn");
                return ["this._lookahead(", x, ")"].join("")
            }).call(this)
        },
        "Form": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                x;
            return (function() {
                x = this._apply("transFn");
                return ["this._form(", x, ")"].join("")
            }).call(this)
        },
        "ConsBy": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                x;
            return (function() {
                x = this._apply("transFn");
                return ["this._consumedBy(", x, ")"].join("")
            }).call(this)
        },
        "IdxConsBy": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                x;
            return (function() {
                x = this._apply("transFn");
                return ["this._idxConsumedBy(", x, ")"].join("")
            }).call(this)
        },
        "JumpTable": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                cases;
            return (function() {
                cases = this._many((function() {
                    return this._apply("jtCase")
                }));
                return this.jumpTableCode(cases)
            }).call(this)
        },
        "Interleave": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                xs;
            return (function() {
                xs = this._many((function() {
                    return this._apply("intPart")
                }));
                return ["this._interleave(", xs.join(","), ")"].join("")
            }).call(this)
        },
        "Rule": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                name, ls, body;
            return (function() {
                name = this._apply("anything");
                (this["rName"] = name);
                ls = this._apply("locals");
                body = this._apply("trans");
                return ["\n\"", name, "\":function(){", ls, "return ", body, "}"].join("")
            }).call(this)
        },
        "Grammar": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                name, sName, rules;
            return (function() {
                name = this._apply("anything");
                sName = this._apply("anything");
                (this["name"] = name);
                (this["sName"] = sName);
                rules = this._many((function() {
                    return this._apply("trans")
                }));
                return [name, "=objectThatDelegatesTo(", sName, ",{", rules.join(","), "})"].join("")
            }).call(this)
        },
        "intPart": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                mode, part;
            return (function() {
                this._form((function() {
                    return (function() {
                        mode = this._apply("anything");
                        return part = this._apply("transFn")
                    }).call(this)
                }));
                return ((mode.toProgramString() + ",") + part)
            }).call(this)
        },
        "jtCase": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                x, e;
            return (function() {
                this._form((function() {
                    return (function() {
                        x = this._apply("anything");
                        return e = this._apply("trans")
                    }).call(this)
                }));
                return [x.toProgramString(), e]
            }).call(this)
        },
        "locals": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                vs;
            return this._or((function() {
                return (function() {
                    this._form((function() {
                        return vs = this._many1((function() {
                            return this._apply("string")
                        }))
                    }));
                    return ["var ", vs.join(","), ";"].join("")
                }).call(this)
            }), (function() {
                return (function() {
                    this._form((function() {
                        return undefined
                    }));
                    return ""
                }).call(this)
            }))
        },
        "trans": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                t, ans;
            return (function() {
                this._form((function() {
                    return (function() {
                        t = this._apply("anything");
                        return ans = this._applyWithArgs("apply", t)
                    }).call(this)
                }));
                return ans
            }).call(this)
        },
        "transFn": function() {
            var $elf = this,
                _fromIdx = this.input.idx,
                x;
            return (function() {
                x = this._apply("trans");
                return ["(function(){return ", x, "})"].join("")
            }).call(this)
        }
    });
    (BSOMetaTranslator["jumpTableCode"] = (function(cases) {
        var buf = new StringBuffer();
        buf.nextPutAll("(function(){switch(this._apply(\'anything\')){");
        for (var i = (0);
        (i < cases["length"]);
        (i += (1))) {
            buf.nextPutAll((((("case " + cases[i][(0)]) + ":return ") + cases[i][(1)]) + ";"))
        };
        buf.nextPutAll("default: throw fail}}).call(this)");
        return buf.contents()
    }))
}
