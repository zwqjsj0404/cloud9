/**
 * Search module for the Cloud9 IDE
 *
 * @copyright 2012, Ajax.org B.V.
 * @license GPLv3 <http://www.gnu.org/licenses/gpl.txt>
 */

"use strict";

"mocha";

var Assert = require("assert");
var Path = require("path");
var Fs = require("fs");
var Os = require("os");

var agModule = require("../cloud9.search.ag");
var nakModule = require("../cloud9.search.nak");
Fs.exists = Fs.exists || Path.exists;

var VfsLocal = require("vfs-local");
var Search = require("./search");

var basePath = Path.join(__dirname, "fixtures");

var options1 = {
                query: "sriracha",
                needle: "sriracha",
                pattern: "",
                casesensitive: false,
                regexp: false,
                replaceAll: false,
                replacement: "",
                wholeword: false,
                command: "codesearch",
                path: ""
            },
    options2 = {
                query: "Messenger",
                needle: "Messenger",
                pattern: "",
                casesensitive: true,
                regexp: false,
                replaceAll: false,
                replacement: "",
                wholeword: false,
                command: "codesearch",
                path: ""
            },
    options3 = {
                query: "gastro",
                needle: "gastro",
                pattern: "",
                casesensitive: false,
                regexp: false,
                replaceAll: false,
                replacement: "",
                wholeword: true,
                command: "codesearch",
                path: ""
            },
    options4 = {
                query: "pb.",
                needle: "pb.",
                pattern: "",
                casesensitive: false,
                regexp: true,
                replaceAll: false,
                replacement: "",
                wholeword: false,
                command: "codesearch",
                path: ""
            },
    options5 = {
                query: ".+wave",
                needle: ".+wave",
                pattern: "",
                casesensitive: true,
                regexp: true,
                replaceAll: false,
                replacement: "",
                wholeword: false,
                command: "codesearch",
                path: "",
                hidden: true
            },
    options6 = {
                query: "shorts",
                needle: "shorts",
                pattern: "*.txt, file*.gif",
                casesensitive: true,
                regexp: true,
                replaceAll: false,
                replacement: "",
                wholeword: false,
                command: "codesearch",
                path: ""
            },
    options7 = {
                query: "williamsburg",
                needle: "williamsburg",
                pattern: "-file*.txt",
                casesensitive: true,
                regexp: true,
                replaceAll: false,
                replacement: "",
                wholeword: false,
                command: "codesearch",
                path: "",
                hidden: true
            };
    
describe("search", function() {
    var o;
    var vfs = VfsLocal({ root: "/" });

    var platform = Os.platform(),
        arch = Os.arch(),
        agCmd = Path.join(__dirname, "..", "cloud9.search.ag", [platform, arch].join("_"), "ag"),
        nakCmd = "node " + Path.join(__dirname, "..", "..", "node_modules", "nak", "bin", "nak");

    var AgLib = agModule({
        agCmd: agCmd,
        nakCmd: nakCmd,
        test: true
    });

    var NakLib = nakModule({
        nakCmd: nakCmd,
        test: true
    });
    var useAg;

    Fs.exists(agCmd, function(exists) {
        useAg = exists;
        beforeEach(function() {
            o = new Search();
            o.setEnv({ 
                basePath: basePath
            });
        });
    });

    it("should find matches without regexp, case-sensitive OFF and word boundaries OFF",  function(next) {
        var out = "";
        
        o.setEnv({ 
            searchType: AgLib
        });
        
        o.exec(options1, vfs,
            // data
            function(msg) {
                out += msg.data;
            },
            // exit
            function(code, stderr, msg) {
                if (useAg) {
                    Assert.equal(code, 0);
                    Assert.equal(msg.count, 6);
                    Assert.equal(msg.filecount, 4);
                    var lines = out.split("\n");
                    Assert.equal(lines.length, 13);
                }

                o.setEnv({ 
                    searchType: NakLib
                });
                        
                out = options1.path = "";
                
                o.exec(options1, vfs,
                    // data
                    function(msg) {
                        out += msg.data;
                    },
                    // exit
                    function(code, stderr, msg) {
                        Assert.equal(code, 0);
                        Assert.equal(msg.count, 6);
                        Assert.equal(msg.filecount, 4);
                        var lines = out.split("\n");
                        Assert.equal(lines.length, 13);
                        
                        next();
                    }
                );
            }
        );
    });

    it("should find matches without regexp, case-sensitive ON and word boundaries OFF",  function(next) {
        var out = "";

        o.setEnv({ 
            searchType: AgLib
        });
        
        o.exec(options2, vfs,
            // data
            function(msg) {
                out += msg.data;
            },
            // exit
            function(code, stderr, msg) {
                if (useAg) {
                    Assert.equal(code, 0);
                    Assert.equal(msg.count, 2);
                    Assert.equal(msg.filecount, 2);
                    var lines = out.split("\n");
                    Assert.equal(lines.length, 5);
                }

                o.setEnv({ 
                    searchType: NakLib
                });
                
                out = options2.path = "";
                
                o.exec(options2, vfs,
                    // data
                    function(msg) {
                        out += msg.data;
                    },
                    // exit
                    function(code, stderr, msg) {
                        Assert.equal(code, 0);
                        Assert.equal(msg.count, 2);
                        Assert.equal(msg.filecount, 2);
                        var lines = out.split("\n");
                        Assert.equal(lines.length, 5);
                        
                        next();
                    }
                );
            }
        );
    });

    it("should find matches without regexp, case-sensitive OFF and word boundaries ON",  function(next) {
        var out = "";
        
        o.setEnv({ 
            searchType: AgLib
        });
        
        o.exec(options3, vfs,
            // data
            function(msg) {
                out += msg.data;
            },
            // exit
            function(code, stderr, msg) {
                if (useAg) {
                    Assert.equal(code, 0);
                    Assert.equal(msg.count, 3);
                    Assert.equal(msg.filecount, 3);
                    var lines = out.split("\n");
                    Assert.equal(lines.length, 8);
                }

                o.setEnv({ 
                    searchType: NakLib
                });
                
                out = options3.path = "";
                
                o.exec(options3, vfs,
                    // data
                    function(msg) {
                        out += msg.data;
                    },
                    // exit
                    function(code, stderr, msg) {
                        Assert.equal(code, 0);
                        Assert.equal(msg.count, 3);
                        Assert.equal(msg.filecount, 3);
                        var lines = out.split("\n");
                        Assert.equal(lines.length, 8);
                        
                        next();
                    }
                );
            }
        );
    });

    it("should find matches with a regexp, case-sensitive OFF",  function(next) {
        var out = "";
        
        o.setEnv({ 
            searchType: AgLib
        });
        
        o.exec(options4, vfs,
            // data
            function(msg) {
                out += msg.data;
            },
            // exit
            function(code, stderr, msg) {
                if (useAg) {
                    Assert.equal(code, 0);
                    Assert.equal(msg.count, 8);
                    Assert.equal(msg.filecount, 4);
                    var lines = out.split("\n");
                    Assert.equal(lines.length, 15);
                }

                o.setEnv({ 
                    searchType: NakLib
                });
                
                out = options4.path = "";
                
                o.exec(options4, vfs,
                    // data
                    function(msg) {
                        out += msg.data;
                    },
                    // exit
                    function(code, stderr, msg) {
                        Assert.equal(code, 0);
                        Assert.equal(msg.count, 8);
                        Assert.equal(msg.filecount, 4);
                        var lines = out.split("\n");
                        Assert.equal(lines.length, 15);
                        
                        next();
                    }
                );
            }
        );
    });
    
    it("should find matches with a regexp, case-sensitive ON, including the default .agignore file, and hidden files",  function(next) {
        var out = "";
        
        o.setEnv({ 
            searchType: AgLib
        });
        
        o.exec(options5, vfs,
            // data
            function(msg) {
                out += msg.data;
            },
            // exit
            function(code, stderr, msg) {
                if (useAg) {
                    Assert.equal(code, 0);
                    Assert.equal(msg.count, 14);
                    Assert.equal(msg.filecount, 7);
                    var lines = out.split("\n");
                    Assert.equal(lines.length, 27);
                }
                
                o.setEnv({ 
                    searchType: NakLib
                });
                
                out = options5.path = "";
                
                o.exec(options5, vfs,
                    // data
                    function(msg) {
                        out += msg.data;
                    },
                    // exit
                    function(code, stderr, msg) {
                        Assert.equal(code, 0);
                        Assert.equal(msg.count, 14);
                        Assert.equal(msg.filecount, 7);
                        var lines = out.split("\n");
                        Assert.equal(lines.length, 27);
                        
                        next();
                    }
                );
            }
        );
    });
 
    it("should find matches without regexp, only two file types, and no hidden files (even if they contain the string)",  function(next) {
        var out = "";
        
        o.setEnv({ 
            searchType: AgLib
        });
        
        o.exec(options6, vfs,
            // data
            function(msg) {
                out += msg.data;
            },
            // exit
            function(code, stderr, msg) {
                if (useAg) {
                    Assert.equal(code, 0);
                    Assert.equal(msg.count, 2);
                    Assert.equal(msg.filecount, 2);
                    var lines = out.split("\n");
                    Assert.equal(lines.length, 5);

                    // contains the query, has the right extension,
                    // but we're not searching hidden files
                    Assert.equal(/.file8_hidden.txt/.test(lines), false);
                }

                o.setEnv({ 
                    searchType: NakLib
                });
                
                out = options6.path = "";
                
                o.exec(options6, vfs,
                    // data
                    function(msg) {
                        out += msg.data;
                    },
                    // exit
                    function(code, stderr, msg) {
                        Assert.equal(code, 0);
                        Assert.equal(msg.count, 2);
                        Assert.equal(msg.filecount, 2);
                        var lines = out.split("\n");
                        Assert.equal(lines.length, 5);

                        Assert.equal(/.file8_hidden.txt/.test(lines), false);
                        
                        next();
                    }
                );
            }
        );
    });

    it("should find matches without regexp, excluding txt files",  function(next) {
        var out = "";
        
        o.setEnv({ 
            searchType: AgLib
        });
        
        o.exec(options7, vfs,
            // data
            function(msg) {
                out += msg.data;
            },
            // exit
            function(code, stderr, msg) {
                if (useAg) {
                    Assert.equal(code, 0);
                    Assert.equal(msg.count, 10);
                    Assert.equal(msg.filecount, 4);
                    var lines = out.split("\n");
                    Assert.equal(lines.length, 17);
                }
                    
                o.setEnv({ 
                    searchType: NakLib
                });

                out = options7.path = "";
                
                o.exec(options7, vfs,
                    // data
                    function(msg) {
                        out += msg.data;
                    },
                    // exit
                    function(code, stderr, msg) {
                        Assert.equal(code, 0);
                        Assert.equal(msg.count, 10);
                        Assert.equal(msg.filecount, 4);
                        var lines = out.split("\n");
                        Assert.equal(lines.length, 17);
                        
                        next();
                    }
                );
            }
        );
    });
});