var QRCode;
        !function() {
            function t(e) {
                this.mode = i.MODE_8BIT_BYTE,
                this.data = e,
                this.parsedData = [];
                for (var t = 0, r = this.data.length; t < r; t++) {
                    var n = []
                      , a = this.data.charCodeAt(t);
                    65536 < a ? (n[0] = 240 | (1835008 & a) >>> 18,
                    n[1] = 128 | (258048 & a) >>> 12,
                    n[2] = 128 | (4032 & a) >>> 6,
                    n[3] = 128 | 63 & a) : 2048 < a ? (n[0] = 224 | (61440 & a) >>> 12,
                    n[1] = 128 | (4032 & a) >>> 6,
                    n[2] = 128 | 63 & a) : 128 < a ? (n[0] = 192 | (1984 & a) >>> 6,
                    n[1] = 128 | 63 & a) : n[0] = a,
                    this.parsedData.push(n)
                }
                this.parsedData = Array.prototype.concat.apply([], this.parsedData),
                this.parsedData.length != this.data.length && (this.parsedData.unshift(191),
                this.parsedData.unshift(187),
                this.parsedData.unshift(239))
            }
            function h(e, t) {
                this.typeNumber = e,
                this.errorCorrectLevel = t,
                this.modules = null,
                this.moduleCount = 0,
                this.dataCache = null,
                this.dataList = []
            }
            function g(e, t) {
                if (null == e.length)
                    throw new Error(e.length + "/" + t);
                for (var r = 0; r < e.length && 0 == e[r]; )
                    r++;
                this.num = new Array(e.length - r + t);
                for (var n = 0; n < e.length - r; n++)
                    this.num[n] = e[n + r]
            }
            function c(e, t) {
                this.totalCount = e,
                this.dataCount = t
            }
            function s() {
                this.buffer = [],
                this.length = 0
            }
            function n() {
                var e = !1
                  , t = navigator.userAgent;
                return /android/i.test(t) && (e = !0,
                (t = t.toString().match(/android ([0-9]\.[0-9])/i)) && t[1] && (e = parseFloat(t[1]))),
                e
            }
            function r(e, t) {
                for (var r, n = 1, a = (r = e,
                (e = encodeURI(r).toString().replace(/\%[0-9a-fA-F]{2}/g, "a")).length + (e.length != r ? 3 : 0)), i = 0, o = y.length; i <= o; i++) {
                    var _ = 0;
                    switch (t) {
                    case d.L:
                        _ = y[i][0];
                        break;
                    case d.M:
                        _ = y[i][1];
                        break;
                    case d.Q:
                        _ = y[i][2];
                        break;
                    case d.H:
                        _ = y[i][3]
                    }
                    if (a <= _)
                        break;
                    n++
                }
                if (y.length < n)
                    throw new Error("Too long data");
                return n
            }
            t.prototype = {
                getLength: function(e) {
                    return this.parsedData.length
                },
                write: function(e) {
                    for (var t = 0, r = this.parsedData.length; t < r; t++)
                        e.put(this.parsedData[t], 8)
                }
            },
            h.prototype = {
                addData: function(e) {
                    e = new t(e);
                    this.dataList.push(e),
                    this.dataCache = null
                },
                isDark: function(e, t) {
                    if (e < 0 || this.moduleCount <= e || t < 0 || this.moduleCount <= t)
                        throw new Error(e + "," + t);
                    return this.modules[e][t]
                },
                getModuleCount: function() {
                    return this.moduleCount
                },
                make: function() {
                    this.makeImpl(!1, this.getBestMaskPattern())
                },
                makeImpl: function(e, t) {
                    this.moduleCount = 4 * this.typeNumber + 17,
                    this.modules = new Array(this.moduleCount);
                    for (var r = 0; r < this.moduleCount; r++) {
                        this.modules[r] = new Array(this.moduleCount);
                        for (var n = 0; n < this.moduleCount; n++)
                            this.modules[r][n] = null
                    }
                    this.setupPositionProbePattern(0, 0),
                    this.setupPositionProbePattern(this.moduleCount - 7, 0),
                    this.setupPositionProbePattern(0, this.moduleCount - 7),
                    this.setupPositionAdjustPattern(),
                    this.setupTimingPattern(),
                    this.setupTypeInfo(e, t),
                    7 <= this.typeNumber && this.setupTypeNumber(e),
                    null == this.dataCache && (this.dataCache = h.createData(this.typeNumber, this.errorCorrectLevel, this.dataList)),
                    this.mapData(this.dataCache, t)
                },
                setupPositionProbePattern: function(e, t) {
                    for (var r = -1; r <= 7; r++)
                        if (!(e + r <= -1 || this.moduleCount <= e + r))
                            for (var n = -1; n <= 7; n++)
                                t + n <= -1 || this.moduleCount <= t + n || (this.modules[e + r][t + n] = 0 <= r && r <= 6 && (0 == n || 6 == n) || 0 <= n && n <= 6 && (0 == r || 6 == r) || 2 <= r && r <= 4 && 2 <= n && n <= 4)
                },
                getBestMaskPattern: function() {
                    for (var e = 0, t = 0, r = 0; r < 8; r++) {
                        this.makeImpl(!0, r);
                        var n = m.getLostPoint(this);
                        (0 == r || n < e) && (e = n,
                        t = r)
                    }
                    return t
                },
                createMovieClip: function(e, t, r) {
                    var n = e.createEmptyMovieClip(t, r);
                    this.make();
                    for (var a = 0; a < this.modules.length; a++)
                        for (var i = +a, o = 0; o < this.modules[a].length; o++) {
                            var _ = +o;
                            this.modules[a][o] && (n.beginFill(0, 100),
                            n.moveTo(_, i),
                            n.lineTo(1 + _, i),
                            n.lineTo(1 + _, 1 + i),
                            n.lineTo(_, 1 + i),
                            n.endFill())
                        }
                    return n
                },
                setupTimingPattern: function() {
                    for (var e = 8; e < this.moduleCount - 8; e++)
                        null == this.modules[e][6] && (this.modules[e][6] = e % 2 == 0);
                    for (var t = 8; t < this.moduleCount - 8; t++)
                        null == this.modules[6][t] && (this.modules[6][t] = t % 2 == 0)
                },
                setupPositionAdjustPattern: function() {
                    for (var e = m.getPatternPosition(this.typeNumber), t = 0; t < e.length; t++)
                        for (var r = 0; r < e.length; r++) {
                            var n = e[t]
                              , a = e[r];
                            if (null == this.modules[n][a])
                                for (var i = -2; i <= 2; i++)
                                    for (var o = -2; o <= 2; o++)
                                        this.modules[n + i][a + o] = -2 == i || 2 == i || -2 == o || 2 == o || 0 == i && 0 == o
                        }
                },
                setupTypeNumber: function(e) {
                    for (var t = m.getBCHTypeNumber(this.typeNumber), r = 0; r < 18; r++) {
                        var n = !e && 1 == (t >> r & 1);
                        this.modules[Math.floor(r / 3)][r % 3 + this.moduleCount - 8 - 3] = n
                    }
                    for (r = 0; r < 18; r++) {
                        n = !e && 1 == (t >> r & 1);
                        this.modules[r % 3 + this.moduleCount - 8 - 3][Math.floor(r / 3)] = n
                    }
                },
                setupTypeInfo: function(e, t) {
                    for (var t = this.errorCorrectLevel << 3 | t, r = m.getBCHTypeInfo(t), n = 0; n < 15; n++) {
                        var a = !e && 1 == (r >> n & 1);
                        n < 6 ? this.modules[n][8] = a : n < 8 ? this.modules[n + 1][8] = a : this.modules[this.moduleCount - 15 + n][8] = a
                    }
                    for (n = 0; n < 15; n++) {
                        a = !e && 1 == (r >> n & 1);
                        n < 8 ? this.modules[8][this.moduleCount - n - 1] = a : n < 9 ? this.modules[8][15 - n - 1 + 1] = a : this.modules[8][15 - n - 1] = a
                    }
                    this.modules[this.moduleCount - 8][8] = !e
                },
                mapData: function(e, t) {
                    for (var r = -1, n = this.moduleCount - 1, a = 7, i = 0, o = this.moduleCount - 1; 0 < o; o -= 2)
                        for (6 == o && o--; ; ) {
                            for (var _, h = 0; h < 2; h++)
                                null == this.modules[n][o - h] && (_ = !1,
                                i < e.length && (_ = 1 == (e[i] >>> a & 1)),
                                m.getMask(t, n, o - h) && (_ = !_),
                                this.modules[n][o - h] = _,
                                -1 == --a && (i++,
                                a = 7));
                            if ((n += r) < 0 || this.moduleCount <= n) {
                                n -= r,
                                r = -r;
                                break
                            }
                        }
                }
            },
            h.PAD0 = 236,
            h.PAD1 = 17,
            h.createData = function(e, t, r) {
                for (var n = c.getRSBlocks(e, t), a = new s, i = 0; i < r.length; i++) {
                    var o = r[i];
                    a.put(o.mode, 4),
                    a.put(o.getLength(), m.getLengthInBits(o.mode, e)),
                    o.write(a)
                }
                for (var _ = 0, i = 0; i < n.length; i++)
                    _ += n[i].dataCount;
                if (a.getLengthInBits() > 8 * _)
                    throw new Error("code length overflow. (" + a.getLengthInBits() + ">" + 8 * _ + ")");
                for (a.getLengthInBits() + 4 <= 8 * _ && a.put(0, 4); a.getLengthInBits() % 8 != 0; )
                    a.putBit(!1);
                for (; !(a.getLengthInBits() >= 8 * _ || (a.put(h.PAD0, 8),
                a.getLengthInBits() >= 8 * _)); )
                    a.put(h.PAD1, 8);
                return h.createBytes(a, n)
            }
            ,
            h.createBytes = function(e, t) {
                for (var r = 0, n = 0, a = 0, i = new Array(t.length), o = new Array(t.length), _ = 0; _ < t.length; _++) {
                    var h = t[_].dataCount
                      , s = t[_].totalCount - h
                      , n = Math.max(n, h)
                      , a = Math.max(a, s);
                    i[_] = new Array(h);
                    for (var c = 0; c < i[_].length; c++)
                        i[_][c] = 255 & e.buffer[c + r];
                    r += h;
                    var s = m.getErrorCorrectPolynomial(s)
                      , d = new g(i[_],s.getLength() - 1).mod(s);
                    o[_] = new Array(s.getLength() - 1);
                    for (c = 0; c < o[_].length; c++) {
                        var w = c + d.getLength() - o[_].length;
                        o[_][c] = 0 <= w ? d.get(w) : 0
                    }
                }
                for (var f = 0, c = 0; c < t.length; c++)
                    f += t[c].totalCount;
                for (var u = new Array(f), l = 0, c = 0; c < n; c++)
                    for (_ = 0; _ < t.length; _++)
                        c < i[_].length && (u[l++] = i[_][c]);
                for (c = 0; c < a; c++)
                    for (_ = 0; _ < t.length; _++)
                        c < o[_].length && (u[l++] = o[_][c]);
                return u
            }
            ;
            for (var i = {
                MODE_NUMBER: 1,
                MODE_ALPHA_NUM: 2,
                MODE_8BIT_BYTE: 4,
                MODE_KANJI: 8
            }, d = {
                L: 1,
                M: 0,
                Q: 3,
                H: 2
            }, a = 0, o = 1, _ = 2, w = 3, f = 4, u = 5, l = 6, v = 7, m = {
                PATTERN_POSITION_TABLE: [[], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90], [6, 28, 50, 72, 94], [6, 26, 50, 74, 98], [6, 30, 54, 78, 102], [6, 28, 54, 80, 106], [6, 32, 58, 84, 110], [6, 30, 58, 86, 114], [6, 34, 62, 90, 118], [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126], [6, 26, 52, 78, 104, 130], [6, 30, 56, 82, 108, 134], [6, 34, 60, 86, 112, 138], [6, 30, 58, 86, 114, 142], [6, 34, 62, 90, 118, 146], [6, 30, 54, 78, 102, 126, 150], [6, 24, 50, 76, 102, 128, 154], [6, 28, 54, 80, 106, 132, 158], [6, 32, 58, 84, 110, 136, 162], [6, 26, 54, 82, 110, 138, 166], [6, 30, 58, 86, 114, 142, 170]],
                G15: 1335,
                G18: 7973,
                G15_MASK: 21522,
                getBCHTypeInfo: function(e) {
                    for (var t = e << 10; 0 <= m.getBCHDigit(t) - m.getBCHDigit(m.G15); )
                        t ^= m.G15 << m.getBCHDigit(t) - m.getBCHDigit(m.G15);
                    return (e << 10 | t) ^ m.G15_MASK
                },
                getBCHTypeNumber: function(e) {
                    for (var t = e << 12; 0 <= m.getBCHDigit(t) - m.getBCHDigit(m.G18); )
                        t ^= m.G18 << m.getBCHDigit(t) - m.getBCHDigit(m.G18);
                    return e << 12 | t
                },
                getBCHDigit: function(e) {
                    for (var t = 0; 0 != e; )
                        t++,
                        e >>>= 1;
                    return t
                },
                getPatternPosition: function(e) {
                    return m.PATTERN_POSITION_TABLE[e - 1]
                },
                getMask: function(e, t, r) {
                    switch (e) {
                    case a:
                        return (t + r) % 2 == 0;
                    case o:
                        return t % 2 == 0;
                    case _:
                        return r % 3 == 0;
                    case w:
                        return (t + r) % 3 == 0;
                    case f:
                        return (Math.floor(t / 2) + Math.floor(r / 3)) % 2 == 0;
                    case u:
                        return t * r % 2 + t * r % 3 == 0;
                    case l:
                        return (t * r % 2 + t * r % 3) % 2 == 0;
                    case v:
                        return (t * r % 3 + (t + r) % 2) % 2 == 0;
                    default:
                        throw new Error("bad maskPattern:" + e)
                    }
                },
                getErrorCorrectPolynomial: function(e) {
                    for (var t = new g([1],0), r = 0; r < e; r++)
                        t = t.multiply(new g([1, p.gexp(r)],0));
                    return t
                },
                getLengthInBits: function(e, t) {
                    if (1 <= t && t < 10)
                        switch (e) {
                        case i.MODE_NUMBER:
                            return 10;
                        case i.MODE_ALPHA_NUM:
                            return 9;
                        case i.MODE_8BIT_BYTE:
                        case i.MODE_KANJI:
                            return 8;
                        default:
                            throw new Error("mode:" + e)
                        }
                    else if (t < 27)
                        switch (e) {
                        case i.MODE_NUMBER:
                            return 12;
                        case i.MODE_ALPHA_NUM:
                            return 11;
                        case i.MODE_8BIT_BYTE:
                            return 16;
                        case i.MODE_KANJI:
                            return 10;
                        default:
                            throw new Error("mode:" + e)
                        }
                    else {
                        if (!(t < 41))
                            throw new Error("type:" + t);
                        switch (e) {
                        case i.MODE_NUMBER:
                            return 14;
                        case i.MODE_ALPHA_NUM:
                            return 13;
                        case i.MODE_8BIT_BYTE:
                            return 16;
                        case i.MODE_KANJI:
                            return 12;
                        default:
                            throw new Error("mode:" + e)
                        }
                    }
                },
                getLostPoint: function(e) {
                    for (var t = e.getModuleCount(), r = 0, n = 0; n < t; n++)
                        for (var a = 0; a < t; a++) {
                            for (var i = 0, o = e.isDark(n, a), _ = -1; _ <= 1; _++)
                                if (!(n + _ < 0 || t <= n + _))
                                    for (var h = -1; h <= 1; h++)
                                        a + h < 0 || t <= a + h || 0 == _ && 0 == h || o != e.isDark(n + _, a + h) || i++;
                            5 < i && (r += 3 + i - 5)
                        }
                    for (n = 0; n < t - 1; n++)
                        for (a = 0; a < t - 1; a++) {
                            var s = 0;
                            e.isDark(n, a) && s++,
                            e.isDark(n + 1, a) && s++,
                            e.isDark(n, a + 1) && s++,
                            e.isDark(n + 1, a + 1) && s++,
                            0 != s && 4 != s || (r += 3)
                        }
                    for (n = 0; n < t; n++)
                        for (a = 0; a < t - 6; a++)
                            e.isDark(n, a) && !e.isDark(n, a + 1) && e.isDark(n, a + 2) && e.isDark(n, a + 3) && e.isDark(n, a + 4) && !e.isDark(n, a + 5) && e.isDark(n, a + 6) && (r += 40);
                    for (a = 0; a < t; a++)
                        for (n = 0; n < t - 6; n++)
                            e.isDark(n, a) && !e.isDark(n + 1, a) && e.isDark(n + 2, a) && e.isDark(n + 3, a) && e.isDark(n + 4, a) && !e.isDark(n + 5, a) && e.isDark(n + 6, a) && (r += 40);
                    for (var c = 0, a = 0; a < t; a++)
                        for (n = 0; n < t; n++)
                            e.isDark(n, a) && c++;
                    return r + 10 * (Math.abs(100 * c / t / t - 50) / 5)
                }
            }, p = {
                glog: function(e) {
                    if (e < 1)
                        throw new Error("glog(" + e + ")");
                    return p.LOG_TABLE[e]
                },
                gexp: function(e) {
                    for (; e < 0; )
                        e += 255;
                    for (; 256 <= e; )
                        e -= 255;
                    return p.EXP_TABLE[e]
                },
                EXP_TABLE: new Array(256),
                LOG_TABLE: new Array(256)
            }, e = 0; e < 8; e++)
                p.EXP_TABLE[e] = 1 << e;
            for (e = 8; e < 256; e++)
                p.EXP_TABLE[e] = p.EXP_TABLE[e - 4] ^ p.EXP_TABLE[e - 5] ^ p.EXP_TABLE[e - 6] ^ p.EXP_TABLE[e - 8];
            for (e = 0; e < 255; e++)
                p.LOG_TABLE[p.EXP_TABLE[e]] = e;
            g.prototype = {
                get: function(e) {
                    return this.num[e]
                },
                getLength: function() {
                    return this.num.length
                },
                multiply: function(e) {
                    for (var t = new Array(this.getLength() + e.getLength() - 1), r = 0; r < this.getLength(); r++)
                        for (var n = 0; n < e.getLength(); n++)
                            t[r + n] ^= p.gexp(p.glog(this.get(r)) + p.glog(e.get(n)));
                    return new g(t,0)
                },
                mod: function(e) {
                    if (this.getLength() - e.getLength() < 0)
                        return this;
                    for (var t = p.glog(this.get(0)) - p.glog(e.get(0)), r = new Array(this.getLength()), n = 0; n < this.getLength(); n++)
                        r[n] = this.get(n);
                    for (n = 0; n < e.getLength(); n++)
                        r[n] ^= p.gexp(p.glog(e.get(n)) + t);
                    return new g(r,0).mod(e)
                }
            },
            c.RS_BLOCK_TABLE = [[1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9], [1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16], [1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13], [1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9], [1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12], [2, 86, 68], [4, 43, 27], [4, 43, 19], [4, 43, 15], [2, 98, 78], [4, 49, 31], [2, 32, 14, 4, 33, 15], [4, 39, 13, 1, 40, 14], [2, 121, 97], [2, 60, 38, 2, 61, 39], [4, 40, 18, 2, 41, 19], [4, 40, 14, 2, 41, 15], [2, 146, 116], [3, 58, 36, 2, 59, 37], [4, 36, 16, 4, 37, 17], [4, 36, 12, 4, 37, 13], [2, 86, 68, 2, 87, 69], [4, 69, 43, 1, 70, 44], [6, 43, 19, 2, 44, 20], [6, 43, 15, 2, 44, 16], [4, 101, 81], [1, 80, 50, 4, 81, 51], [4, 50, 22, 4, 51, 23], [3, 36, 12, 8, 37, 13], [2, 116, 92, 2, 117, 93], [6, 58, 36, 2, 59, 37], [4, 46, 20, 6, 47, 21], [7, 42, 14, 4, 43, 15], [4, 133, 107], [8, 59, 37, 1, 60, 38], [8, 44, 20, 4, 45, 21], [12, 33, 11, 4, 34, 12], [3, 145, 115, 1, 146, 116], [4, 64, 40, 5, 65, 41], [11, 36, 16, 5, 37, 17], [11, 36, 12, 5, 37, 13], [5, 109, 87, 1, 110, 88], [5, 65, 41, 5, 66, 42], [5, 54, 24, 7, 55, 25], [11, 36, 12], [5, 122, 98, 1, 123, 99], [7, 73, 45, 3, 74, 46], [15, 43, 19, 2, 44, 20], [3, 45, 15, 13, 46, 16], [1, 135, 107, 5, 136, 108], [10, 74, 46, 1, 75, 47], [1, 50, 22, 15, 51, 23], [2, 42, 14, 17, 43, 15], [5, 150, 120, 1, 151, 121], [9, 69, 43, 4, 70, 44], [17, 50, 22, 1, 51, 23], [2, 42, 14, 19, 43, 15], [3, 141, 113, 4, 142, 114], [3, 70, 44, 11, 71, 45], [17, 47, 21, 4, 48, 22], [9, 39, 13, 16, 40, 14], [3, 135, 107, 5, 136, 108], [3, 67, 41, 13, 68, 42], [15, 54, 24, 5, 55, 25], [15, 43, 15, 10, 44, 16], [4, 144, 116, 4, 145, 117], [17, 68, 42], [17, 50, 22, 6, 51, 23], [19, 46, 16, 6, 47, 17], [2, 139, 111, 7, 140, 112], [17, 74, 46], [7, 54, 24, 16, 55, 25], [34, 37, 13], [4, 151, 121, 5, 152, 122], [4, 75, 47, 14, 76, 48], [11, 54, 24, 14, 55, 25], [16, 45, 15, 14, 46, 16], [6, 147, 117, 4, 148, 118], [6, 73, 45, 14, 74, 46], [11, 54, 24, 16, 55, 25], [30, 46, 16, 2, 47, 17], [8, 132, 106, 4, 133, 107], [8, 75, 47, 13, 76, 48], [7, 54, 24, 22, 55, 25], [22, 45, 15, 13, 46, 16], [10, 142, 114, 2, 143, 115], [19, 74, 46, 4, 75, 47], [28, 50, 22, 6, 51, 23], [33, 46, 16, 4, 47, 17], [8, 152, 122, 4, 153, 123], [22, 73, 45, 3, 74, 46], [8, 53, 23, 26, 54, 24], [12, 45, 15, 28, 46, 16], [3, 147, 117, 10, 148, 118], [3, 73, 45, 23, 74, 46], [4, 54, 24, 31, 55, 25], [11, 45, 15, 31, 46, 16], [7, 146, 116, 7, 147, 117], [21, 73, 45, 7, 74, 46], [1, 53, 23, 37, 54, 24], [19, 45, 15, 26, 46, 16], [5, 145, 115, 10, 146, 116], [19, 75, 47, 10, 76, 48], [15, 54, 24, 25, 55, 25], [23, 45, 15, 25, 46, 16], [13, 145, 115, 3, 146, 116], [2, 74, 46, 29, 75, 47], [42, 54, 24, 1, 55, 25], [23, 45, 15, 28, 46, 16], [17, 145, 115], [10, 74, 46, 23, 75, 47], [10, 54, 24, 35, 55, 25], [19, 45, 15, 35, 46, 16], [17, 145, 115, 1, 146, 116], [14, 74, 46, 21, 75, 47], [29, 54, 24, 19, 55, 25], [11, 45, 15, 46, 46, 16], [13, 145, 115, 6, 146, 116], [14, 74, 46, 23, 75, 47], [44, 54, 24, 7, 55, 25], [59, 46, 16, 1, 47, 17], [12, 151, 121, 7, 152, 122], [12, 75, 47, 26, 76, 48], [39, 54, 24, 14, 55, 25], [22, 45, 15, 41, 46, 16], [6, 151, 121, 14, 152, 122], [6, 75, 47, 34, 76, 48], [46, 54, 24, 10, 55, 25], [2, 45, 15, 64, 46, 16], [17, 152, 122, 4, 153, 123], [29, 74, 46, 14, 75, 47], [49, 54, 24, 10, 55, 25], [24, 45, 15, 46, 46, 16], [4, 152, 122, 18, 153, 123], [13, 74, 46, 32, 75, 47], [48, 54, 24, 14, 55, 25], [42, 45, 15, 32, 46, 16], [20, 147, 117, 4, 148, 118], [40, 75, 47, 7, 76, 48], [43, 54, 24, 22, 55, 25], [10, 45, 15, 67, 46, 16], [19, 148, 118, 6, 149, 119], [18, 75, 47, 31, 76, 48], [34, 54, 24, 34, 55, 25], [20, 45, 15, 61, 46, 16]],
            c.getRSBlocks = function(e, t) {
                var r = c.getRsBlockTable(e, t);
                if (null == r)
                    throw new Error("bad rs block @ typeNumber:" + e + "/errorCorrectLevel:" + t);
                for (var n = r.length / 3, a = [], i = 0; i < n; i++)
                    for (var o = r[3 * i + 0], _ = r[3 * i + 1], h = r[3 * i + 2], s = 0; s < o; s++)
                        a.push(new c(_,h));
                return a
            }
            ,
            c.getRsBlockTable = function(e, t) {
                switch (t) {
                case d.L:
                    return c.RS_BLOCK_TABLE[4 * (e - 1) + 0];
                case d.M:
                    return c.RS_BLOCK_TABLE[4 * (e - 1) + 1];
                case d.Q:
                    return c.RS_BLOCK_TABLE[4 * (e - 1) + 2];
                case d.H:
                    return c.RS_BLOCK_TABLE[4 * (e - 1) + 3];
                default:
                    return
                }
            }
            ,
            s.prototype = {
                get: function(e) {
                    var t = Math.floor(e / 8);
                    return 1 == (this.buffer[t] >>> 7 - e % 8 & 1)
                },
                put: function(e, t) {
                    for (var r = 0; r < t; r++)
                        this.putBit(1 == (e >>> t - r - 1 & 1))
                },
                getLengthInBits: function() {
                    return this.length
                },
                putBit: function(e) {
                    var t = Math.floor(this.length / 8);
                    this.buffer.length <= t && this.buffer.push(0),
                    e && (this.buffer[t] |= 128 >>> this.length % 8),
                    this.length++
                }
            };
            var y = [[17, 14, 11, 7], [32, 26, 20, 14], [53, 42, 32, 24], [78, 62, 46, 34], [106, 84, 60, 44], [134, 106, 74, 58], [154, 122, 86, 64], [192, 152, 108, 84], [230, 180, 130, 98], [271, 213, 151, 119], [321, 251, 177, 137], [367, 287, 203, 155], [425, 331, 241, 177], [458, 362, 258, 194], [520, 412, 292, 220], [586, 450, 322, 250], [644, 504, 364, 280], [718, 560, 394, 310], [792, 624, 442, 338], [858, 666, 482, 382], [929, 711, 509, 403], [1003, 779, 565, 439], [1091, 857, 611, 461], [1171, 911, 661, 511], [1273, 997, 715, 535], [1367, 1059, 751, 593], [1465, 1125, 805, 625], [1528, 1190, 868, 658], [1628, 1264, 908, 698], [1732, 1370, 982, 742], [1840, 1452, 1030, 790], [1952, 1538, 1112, 842], [2068, 1628, 1168, 898], [2188, 1722, 1228, 958], [2303, 1809, 1283, 983], [2431, 1911, 1351, 1051], [2563, 1989, 1423, 1093], [2699, 2099, 1499, 1139], [2809, 2213, 1579, 1219], [2953, 2331, 1663, 1273]]
              , b = (C.prototype.draw = function(e) {
                function t(e, t) {
                    var r, n = document.createElementNS("http://www.w3.org/2000/svg", e);
                    for (r in t)
                        t.hasOwnProperty(r) && n.setAttribute(r, t[r]);
                    return n
                }
                var r = this._htOption
                  , n = this._el
                  , a = e.getModuleCount();
                Math.floor(r.width / a),
                Math.floor(r.height / a),
                this.clear();
                var i = t("svg", {
                    viewBox: "0 0 " + String(a) + " " + String(a),
                    width: "100%",
                    height: "100%",
                    fill: r.colorLight
                });
                i.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink"),
                n.appendChild(i),
                i.appendChild(t("rect", {
                    fill: r.colorLight,
                    width: "100%",
                    height: "100%"
                })),
                i.appendChild(t("rect", {
                    fill: r.colorDark,
                    width: "1",
                    height: "1",
                    id: "template"
                }));
                for (var o, _ = 0; _ < a; _++)
                    for (var h = 0; h < a; h++)
                        e.isDark(_, h) && ((o = t("use", {
                            x: String(h),
                            y: String(_)
                        })).setAttributeNS("http://www.w3.org/1999/xlink", "href", "#template"),
                        i.appendChild(o))
            }
            ,
            C.prototype.clear = function() {
                for (; this._el.hasChildNodes(); )
                    this._el.removeChild(this._el.lastChild)
            }
            ,
            C)
              , q = "svg" === document.documentElement.tagName.toLowerCase() ? b : "undefined" != typeof CanvasRenderingContext2D ? function() {
                function e() {
                    this._elImage.src = this._elCanvas.toDataURL("image/png"),
                    this._elImage.style.display = "block",
                    this._elCanvas.style.display = "none"
                }
                function t(e, t) {
                    var r = this;
                    if (r._fFail = t,
                    r._fSuccess = e,
                    null === r._bSupportDataURI) {
                        t = document.createElement("img"),
                        e = function() {
                            r._bSupportDataURI = !1,
                            r._fFail && r._fFail.call(r)
                        }
                        ;
                        return t.onabort = e,
                        t.onerror = e,
                        t.onload = function() {
                            r._bSupportDataURI = !0,
                            r._fSuccess && r._fSuccess.call(r)
                        }
                        ,
                        void (t.src = "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==")
                    }
                    !0 === r._bSupportDataURI && r._fSuccess ? r._fSuccess.call(r) : !1 === r._bSupportDataURI && r._fFail && r._fFail.call(r)
                }
                var c, d;
                this._android && this._android <= 2.1 && (c = 1 / window.devicePixelRatio,
                d = CanvasRenderingContext2D.prototype.drawImage,
                CanvasRenderingContext2D.prototype.drawImage = function(e, t, r, n, a, i, o, _, h) {
                    if ("nodeName"in e && /img/i.test(e.nodeName))
                        for (var s = arguments.length - 1; 1 <= s; s--)
                            arguments[s] = arguments[s] * c;
                    else
                        void 0 === _ && (arguments[1] *= c,
                        arguments[2] *= c,
                        arguments[3] *= c,
                        arguments[4] *= c);
                    d.apply(this, arguments)
                }
                );
                function r(e, t) {
                    this._bIsPainted = !1,
                    this._android = n(),
                    this._htOption = t,
                    this._elCanvas = document.createElement("canvas"),
                    this._elCanvas.width = t.width,
                    this._elCanvas.height = t.height,
                    e.appendChild(this._elCanvas),
                    this._el = e,
                    this._oContext = this._elCanvas.getContext("2d"),
                    this._bIsPainted = !1,
                    this._elImage = document.createElement("img"),
                    this._elImage.alt = "Scan me!",
                    this._elImage.style.display = "none",
                    this._el.appendChild(this._elImage),
                    this._bSupportDataURI = null
                }
                return r.prototype.draw = function(e) {
                    var t = this._elImage
                      , r = this._oContext
                      , n = this._htOption
                      , a = e.getModuleCount()
                      , i = n.width / a
                      , o = n.height / a
                      , _ = Math.round(i)
                      , h = Math.round(o);
                    t.style.display = "none",
                    this.clear();
                    for (var s = 0; s < a; s++)
                        for (var c = 0; c < a; c++) {
                            var d = e.isDark(s, c)
                              , w = c * i
                              , f = s * o;
                            r.strokeStyle = d ? n.colorDark : n.colorLight,
                            r.lineWidth = 1,
                            r.fillStyle = d ? n.colorDark : n.colorLight,
                            r.fillRect(w, f, i, o),
                            r.strokeRect(Math.floor(w) + .5, Math.floor(f) + .5, _, h),
                            r.strokeRect(Math.ceil(w) - .5, Math.ceil(f) - .5, _, h)
                        }
                    this._bIsPainted = !0
                }
                ,
                r.prototype.makeImage = function() {
                    this._bIsPainted && t.call(this, e)
                }
                ,
                r.prototype.isPainted = function() {
                    return this._bIsPainted
                }
                ,
                r.prototype.clear = function() {
                    this._oContext.clearRect(0, 0, this._elCanvas.width, this._elCanvas.height),
                    this._bIsPainted = !1
                }
                ,
                r.prototype.round = function(e) {
                    return e && Math.floor(1e3 * e) / 1e3
                }
                ,
                r
            }() : (A.prototype.draw = function(e) {
                for (var t = this._htOption, r = this._el, n = e.getModuleCount(), a = Math.floor(t.width / n), i = Math.floor(t.height / n), o = ['<table style="border:0;border-collapse:collapse;">'], _ = 0; _ < n; _++) {
                    o.push("<tr>");
                    for (var h = 0; h < n; h++)
                        o.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:' + a + "px;height:" + i + "px;background-color:" + (e.isDark(_, h) ? t.colorDark : t.colorLight) + ';"></td>');
                    o.push("</tr>")
                }
                o.push("</table>"),
                r.innerHTML = o.join("");
                var s = r.childNodes[0]
                  , c = (t.width - s.offsetWidth) / 2
                  , r = (t.height - s.offsetHeight) / 2;
                0 < c && 0 < r && (s.style.margin = r + "px " + c + "px")
            }
            ,
            A.prototype.clear = function() {
                this._el.innerHTML = ""
            }
            ,
            A);
            function A(e, t) {
                this._el = e,
                this._htOption = t
            }
            function C(e, t) {
                this._el = e,
                this._htOption = t
            }
            (QRCode = function(e, t) {
                if (this._htOption = {
                    width: 256,
                    height: 256,
                    typeNumber: 4,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: d.H
                },
                "string" == typeof t && (t = {
                    text: t
                }),
                t)
                    for (var r in t)
                        this._htOption[r] = t[r];
                "string" == typeof e && (e = document.getElementById(e)),
                this._htOption.useSVG && (q = b),
                this._android = n(),
                this._el = e,
                this._oQRCode = null,
                this._oDrawing = new q(this._el,this._htOption),
                this._htOption.text && this.makeCode(this._htOption.text)
            }
            ).prototype.makeCode = function(e) {
                this._oQRCode = new h(r(e, this._htOption.correctLevel),this._htOption.correctLevel),
                this._oQRCode.addData(e),
                this._oQRCode.make(),
                this._el.title = e,
                this._oDrawing.draw(this._oQRCode),
                this.makeImage()
            }
            ,
            QRCode.prototype.makeImage = function() {
                "function" == typeof this._oDrawing.makeImage && (!this._android || 3 <= this._android) && this._oDrawing.makeImage()
            }
            ,
            QRCode.prototype.clear = function() {
                this._oDrawing.clear()
            }
            ,
            QRCode.CorrectLevel = d
        }();
        var _aa = {};
        function _a1(e, t) {
            this.count = e,
            this._fc = t,
            this.__defineGetter__("Count", function() {
                return this.count
            }),
            this.__defineGetter__("_dm", function() {
                return this._fc
            })
        }
        function _a2(e, t, r) {
            this._bm = e,
            this._do = r ? new Array(t,r) : new Array(t),
            this.__defineGetter__("_bo", function() {
                return this._bm
            }),
            this.__defineGetter__("_dn", function() {
                return this._bm * this._fo
            }),
            this.__defineGetter__("_fo", function() {
                for (var e = 0, t = 0; t < this._do.length; t++)
                    e += this._do[t].length;
                return e
            }),
            this._fb = function() {
                return this._do
            }
        }
        function _a3(e, t, r, n, a, i) {
            this._bs = e,
            this._ar = t,
            this._do = new Array(r,n,a,i);
            for (var o = 0, _ = r._bo, h = r._fb(), s = 0; s < h.length; s++) {
                var c = h[s];
                o += c.Count * (c._dm + _)
            }
            this._br = o,
            this.__defineGetter__("_fd", function() {
                return this._bs
            }),
            this.__defineGetter__("_as", function() {
                return this._ar
            }),
            this.__defineGetter__("_dp", function() {
                return this._br
            }),
            this.__defineGetter__("_cr", function() {
                return 17 + 4 * this._bs
            }),
            this._aq = function() {
                var e = this._cr
                  , t = new _ac(e);
                t._bq(0, 0, 9, 9),
                t._bq(e - 8, 0, 8, 9),
                t._bq(0, e - 8, 9, 8);
                for (var r = this._ar.length, n = 0; n < r; n++)
                    for (var a = this._ar[n] - 2, i = 0; i < r; i++)
                        0 == n && (0 == i || i == r - 1) || n == r - 1 && 0 == i || t._bq(this._ar[i] - 2, a, 5, 5);
                return t._bq(6, 9, 1, e - 17),
                t._bq(9, 6, e - 17, 1),
                6 < this._bs && (t._bq(e - 11, 0, 3, 6),
                t._bq(0, e - 11, 6, 3)),
                t
            }
            ,
            this._bu = function(e) {
                return this._do[e.ordinal()]
            }
        }
        function _ay() {
            return new Array(new _a3(1,new Array,new _a2(7,new _a1(1,19)),new _a2(10,new _a1(1,16)),new _a2(13,new _a1(1,13)),new _a2(17,new _a1(1,9))),new _a3(2,new Array(6,18),new _a2(10,new _a1(1,34)),new _a2(16,new _a1(1,28)),new _a2(22,new _a1(1,22)),new _a2(28,new _a1(1,16))),new _a3(3,new Array(6,22),new _a2(15,new _a1(1,55)),new _a2(26,new _a1(1,44)),new _a2(18,new _a1(2,17)),new _a2(22,new _a1(2,13))),new _a3(4,new Array(6,26),new _a2(20,new _a1(1,80)),new _a2(18,new _a1(2,32)),new _a2(26,new _a1(2,24)),new _a2(16,new _a1(4,9))),new _a3(5,new Array(6,30),new _a2(26,new _a1(1,108)),new _a2(24,new _a1(2,43)),new _a2(18,new _a1(2,15),new _a1(2,16)),new _a2(22,new _a1(2,11),new _a1(2,12))),new _a3(6,new Array(6,34),new _a2(18,new _a1(2,68)),new _a2(16,new _a1(4,27)),new _a2(24,new _a1(4,19)),new _a2(28,new _a1(4,15))),new _a3(7,new Array(6,22,38),new _a2(20,new _a1(2,78)),new _a2(18,new _a1(4,31)),new _a2(18,new _a1(2,14),new _a1(4,15)),new _a2(26,new _a1(4,13),new _a1(1,14))),new _a3(8,new Array(6,24,42),new _a2(24,new _a1(2,97)),new _a2(22,new _a1(2,38),new _a1(2,39)),new _a2(22,new _a1(4,18),new _a1(2,19)),new _a2(26,new _a1(4,14),new _a1(2,15))),new _a3(9,new Array(6,26,46),new _a2(30,new _a1(2,116)),new _a2(22,new _a1(3,36),new _a1(2,37)),new _a2(20,new _a1(4,16),new _a1(4,17)),new _a2(24,new _a1(4,12),new _a1(4,13))),new _a3(10,new Array(6,28,50),new _a2(18,new _a1(2,68),new _a1(2,69)),new _a2(26,new _a1(4,43),new _a1(1,44)),new _a2(24,new _a1(6,19),new _a1(2,20)),new _a2(28,new _a1(6,15),new _a1(2,16))),new _a3(11,new Array(6,30,54),new _a2(20,new _a1(4,81)),new _a2(30,new _a1(1,50),new _a1(4,51)),new _a2(28,new _a1(4,22),new _a1(4,23)),new _a2(24,new _a1(3,12),new _a1(8,13))),new _a3(12,new Array(6,32,58),new _a2(24,new _a1(2,92),new _a1(2,93)),new _a2(22,new _a1(6,36),new _a1(2,37)),new _a2(26,new _a1(4,20),new _a1(6,21)),new _a2(28,new _a1(7,14),new _a1(4,15))),new _a3(13,new Array(6,34,62),new _a2(26,new _a1(4,107)),new _a2(22,new _a1(8,37),new _a1(1,38)),new _a2(24,new _a1(8,20),new _a1(4,21)),new _a2(22,new _a1(12,11),new _a1(4,12))),new _a3(14,new Array(6,26,46,66),new _a2(30,new _a1(3,115),new _a1(1,116)),new _a2(24,new _a1(4,40),new _a1(5,41)),new _a2(20,new _a1(11,16),new _a1(5,17)),new _a2(24,new _a1(11,12),new _a1(5,13))),new _a3(15,new Array(6,26,48,70),new _a2(22,new _a1(5,87),new _a1(1,88)),new _a2(24,new _a1(5,41),new _a1(5,42)),new _a2(30,new _a1(5,24),new _a1(7,25)),new _a2(24,new _a1(11,12),new _a1(7,13))),new _a3(16,new Array(6,26,50,74),new _a2(24,new _a1(5,98),new _a1(1,99)),new _a2(28,new _a1(7,45),new _a1(3,46)),new _a2(24,new _a1(15,19),new _a1(2,20)),new _a2(30,new _a1(3,15),new _a1(13,16))),new _a3(17,new Array(6,30,54,78),new _a2(28,new _a1(1,107),new _a1(5,108)),new _a2(28,new _a1(10,46),new _a1(1,47)),new _a2(28,new _a1(1,22),new _a1(15,23)),new _a2(28,new _a1(2,14),new _a1(17,15))),new _a3(18,new Array(6,30,56,82),new _a2(30,new _a1(5,120),new _a1(1,121)),new _a2(26,new _a1(9,43),new _a1(4,44)),new _a2(28,new _a1(17,22),new _a1(1,23)),new _a2(28,new _a1(2,14),new _a1(19,15))),new _a3(19,new Array(6,30,58,86),new _a2(28,new _a1(3,113),new _a1(4,114)),new _a2(26,new _a1(3,44),new _a1(11,45)),new _a2(26,new _a1(17,21),new _a1(4,22)),new _a2(26,new _a1(9,13),new _a1(16,14))),new _a3(20,new Array(6,34,62,90),new _a2(28,new _a1(3,107),new _a1(5,108)),new _a2(26,new _a1(3,41),new _a1(13,42)),new _a2(30,new _a1(15,24),new _a1(5,25)),new _a2(28,new _a1(15,15),new _a1(10,16))),new _a3(21,new Array(6,28,50,72,94),new _a2(28,new _a1(4,116),new _a1(4,117)),new _a2(26,new _a1(17,42)),new _a2(28,new _a1(17,22),new _a1(6,23)),new _a2(30,new _a1(19,16),new _a1(6,17))),new _a3(22,new Array(6,26,50,74,98),new _a2(28,new _a1(2,111),new _a1(7,112)),new _a2(28,new _a1(17,46)),new _a2(30,new _a1(7,24),new _a1(16,25)),new _a2(24,new _a1(34,13))),new _a3(23,new Array(6,30,54,78,102),new _a2(30,new _a1(4,121),new _a1(5,122)),new _a2(28,new _a1(4,47),new _a1(14,48)),new _a2(30,new _a1(11,24),new _a1(14,25)),new _a2(30,new _a1(16,15),new _a1(14,16))),new _a3(24,new Array(6,28,54,80,106),new _a2(30,new _a1(6,117),new _a1(4,118)),new _a2(28,new _a1(6,45),new _a1(14,46)),new _a2(30,new _a1(11,24),new _a1(16,25)),new _a2(30,new _a1(30,16),new _a1(2,17))),new _a3(25,new Array(6,32,58,84,110),new _a2(26,new _a1(8,106),new _a1(4,107)),new _a2(28,new _a1(8,47),new _a1(13,48)),new _a2(30,new _a1(7,24),new _a1(22,25)),new _a2(30,new _a1(22,15),new _a1(13,16))),new _a3(26,new Array(6,30,58,86,114),new _a2(28,new _a1(10,114),new _a1(2,115)),new _a2(28,new _a1(19,46),new _a1(4,47)),new _a2(28,new _a1(28,22),new _a1(6,23)),new _a2(30,new _a1(33,16),new _a1(4,17))),new _a3(27,new Array(6,34,62,90,118),new _a2(30,new _a1(8,122),new _a1(4,123)),new _a2(28,new _a1(22,45),new _a1(3,46)),new _a2(30,new _a1(8,23),new _a1(26,24)),new _a2(30,new _a1(12,15),new _a1(28,16))),new _a3(28,new Array(6,26,50,74,98,122),new _a2(30,new _a1(3,117),new _a1(10,118)),new _a2(28,new _a1(3,45),new _a1(23,46)),new _a2(30,new _a1(4,24),new _a1(31,25)),new _a2(30,new _a1(11,15),new _a1(31,16))),new _a3(29,new Array(6,30,54,78,102,126),new _a2(30,new _a1(7,116),new _a1(7,117)),new _a2(28,new _a1(21,45),new _a1(7,46)),new _a2(30,new _a1(1,23),new _a1(37,24)),new _a2(30,new _a1(19,15),new _a1(26,16))),new _a3(30,new Array(6,26,52,78,104,130),new _a2(30,new _a1(5,115),new _a1(10,116)),new _a2(28,new _a1(19,47),new _a1(10,48)),new _a2(30,new _a1(15,24),new _a1(25,25)),new _a2(30,new _a1(23,15),new _a1(25,16))),new _a3(31,new Array(6,30,56,82,108,134),new _a2(30,new _a1(13,115),new _a1(3,116)),new _a2(28,new _a1(2,46),new _a1(29,47)),new _a2(30,new _a1(42,24),new _a1(1,25)),new _a2(30,new _a1(23,15),new _a1(28,16))),new _a3(32,new Array(6,34,60,86,112,138),new _a2(30,new _a1(17,115)),new _a2(28,new _a1(10,46),new _a1(23,47)),new _a2(30,new _a1(10,24),new _a1(35,25)),new _a2(30,new _a1(19,15),new _a1(35,16))),new _a3(33,new Array(6,30,58,86,114,142),new _a2(30,new _a1(17,115),new _a1(1,116)),new _a2(28,new _a1(14,46),new _a1(21,47)),new _a2(30,new _a1(29,24),new _a1(19,25)),new _a2(30,new _a1(11,15),new _a1(46,16))),new _a3(34,new Array(6,34,62,90,118,146),new _a2(30,new _a1(13,115),new _a1(6,116)),new _a2(28,new _a1(14,46),new _a1(23,47)),new _a2(30,new _a1(44,24),new _a1(7,25)),new _a2(30,new _a1(59,16),new _a1(1,17))),new _a3(35,new Array(6,30,54,78,102,126,150),new _a2(30,new _a1(12,121),new _a1(7,122)),new _a2(28,new _a1(12,47),new _a1(26,48)),new _a2(30,new _a1(39,24),new _a1(14,25)),new _a2(30,new _a1(22,15),new _a1(41,16))),new _a3(36,new Array(6,24,50,76,102,128,154),new _a2(30,new _a1(6,121),new _a1(14,122)),new _a2(28,new _a1(6,47),new _a1(34,48)),new _a2(30,new _a1(46,24),new _a1(10,25)),new _a2(30,new _a1(2,15),new _a1(64,16))),new _a3(37,new Array(6,28,54,80,106,132,158),new _a2(30,new _a1(17,122),new _a1(4,123)),new _a2(28,new _a1(29,46),new _a1(14,47)),new _a2(30,new _a1(49,24),new _a1(10,25)),new _a2(30,new _a1(24,15),new _a1(46,16))),new _a3(38,new Array(6,32,58,84,110,136,162),new _a2(30,new _a1(4,122),new _a1(18,123)),new _a2(28,new _a1(13,46),new _a1(32,47)),new _a2(30,new _a1(48,24),new _a1(14,25)),new _a2(30,new _a1(42,15),new _a1(32,16))),new _a3(39,new Array(6,26,54,82,110,138,166),new _a2(30,new _a1(20,117),new _a1(4,118)),new _a2(28,new _a1(40,47),new _a1(7,48)),new _a2(30,new _a1(43,24),new _a1(22,25)),new _a2(30,new _a1(10,15),new _a1(67,16))),new _a3(40,new Array(6,30,58,86,114,142,170),new _a2(30,new _a1(19,118),new _a1(6,119)),new _a2(28,new _a1(18,47),new _a1(31,48)),new _a2(30,new _a1(34,24),new _a1(34,25)),new _a2(30,new _a1(20,15),new _a1(61,16))))
        }
        function _ae(e, t, r, n, a, i, o, _, h) {
            this.a11 = e,
            this.a12 = n,
            this.a13 = o,
            this.a21 = t,
            this.a22 = a,
            this.a23 = _,
            this.a31 = r,
            this.a32 = i,
            this.a33 = h,
            this._ad = function(e) {
                for (var t = e.length, r = this.a11, n = this.a12, a = this.a13, i = this.a21, o = this.a22, _ = this.a23, h = this.a31, s = this.a32, c = this.a33, d = 0; d < t; d += 2) {
                    var w = e[d]
                      , f = e[d + 1]
                      , u = a * w + _ * f + c;
                    e[d] = (r * w + i * f + h) / u,
                    e[d + 1] = (n * w + o * f + s) / u
                }
            }
            ,
            this._fp = function(e, t) {
                for (var r = e.length, n = 0; n < r; n++) {
                    var a = e[n]
                      , i = t[n]
                      , o = this.a13 * a + this.a23 * i + this.a33;
                    e[n] = (this.a11 * a + this.a21 * i + this.a31) / o,
                    t[n] = (this.a12 * a + this.a22 * i + this.a32) / o
                }
            }
            ,
            this._fr = function() {
                return new _ae(this.a22 * this.a33 - this.a23 * this.a32,this.a23 * this.a31 - this.a21 * this.a33,this.a21 * this.a32 - this.a22 * this.a31,this.a13 * this.a32 - this.a12 * this.a33,this.a11 * this.a33 - this.a13 * this.a31,this.a12 * this.a31 - this.a11 * this.a32,this.a12 * this.a23 - this.a13 * this.a22,this.a13 * this.a21 - this.a11 * this.a23,this.a11 * this.a22 - this.a12 * this.a21)
            }
            ,
            this.times = function(e) {
                return new _ae(this.a11 * e.a11 + this.a21 * e.a12 + this.a31 * e.a13,this.a11 * e.a21 + this.a21 * e.a22 + this.a31 * e.a23,this.a11 * e.a31 + this.a21 * e.a32 + this.a31 * e.a33,this.a12 * e.a11 + this.a22 * e.a12 + this.a32 * e.a13,this.a12 * e.a21 + this.a22 * e.a22 + this.a32 * e.a23,this.a12 * e.a31 + this.a22 * e.a32 + this.a32 * e.a33,this.a13 * e.a11 + this.a23 * e.a12 + this.a33 * e.a13,this.a13 * e.a21 + this.a23 * e.a22 + this.a33 * e.a23,this.a13 * e.a31 + this.a23 * e.a32 + this.a33 * e.a33)
            }
        }
        function _bg(e, t) {
            this.bits = e,
            this.points = t
        }
        function Detector(e) {
            this.image = e,
            this._am = null,
            this._bi = function(e, t, r, n) {
                var a = Math.abs(n - t) > Math.abs(r - e);
                a && (g = e,
                e = t,
                t = g,
                g = r,
                r = n,
                n = g);
                for (var i = Math.abs(r - e), o = Math.abs(n - t), _ = -i >> 1, h = t < n ? 1 : -1, s = e < r ? 1 : -1, c = 0, d = e, w = t; d != r; d += s) {
                    var f = a ? w : d
                      , u = a ? d : w;
                    if (1 == c ? this.image[f + u * qrcode.width] && c++ : this.image[f + u * qrcode.width] || c++,
                    3 == c) {
                        f = d - e,
                        u = w - t;
                        return Math.sqrt(f * f + u * u)
                    }
                    if (0 < (_ += o)) {
                        if (w == n)
                            break;
                        w += h,
                        _ -= i
                    }
                }
                var l = r - e
                  , g = n - t;
                return Math.sqrt(l * l + g * g)
            }
            ,
            this._bh = function(e, t, r, n) {
                var a = this._bi(e, t, r, n)
                  , i = 1
                  , r = e - (r - e);
                r < 0 ? (i = e / (e - r),
                r = 0) : r >= qrcode.width && (i = (qrcode.width - 1 - e) / (r - e),
                r = qrcode.width - 1);
                n = Math.floor(t - (n - t) * i),
                i = 1;
                return n < 0 ? (i = t / (t - n),
                n = 0) : n >= qrcode.height && (i = (qrcode.height - 1 - t) / (n - t),
                n = qrcode.height - 1),
                r = Math.floor(e + (r - e) * i),
                (a += this._bi(e, t, r, n)) - 1
            }
            ,
            this._bj = function(e, t) {
                var r = this._bh(Math.floor(e.X), Math.floor(e.Y), Math.floor(t.X), Math.floor(t.Y))
                  , e = this._bh(Math.floor(t.X), Math.floor(t.Y), Math.floor(e.X), Math.floor(e.Y));
                return isNaN(r) ? e / 7 : isNaN(e) ? r / 7 : (r + e) / 14
            }
            ,
            this._bk = function(e, t, r) {
                return (this._bj(e, t) + this._bj(e, r)) / 2
            }
            ,
            this.distance = function(e, t) {
                var r = e.X - t.X
                  , t = e.Y - t.Y;
                return Math.sqrt(r * r + t * t)
            }
            ,
            this._bx = function(e, t, r, n) {
                var a = 7 + (Math.round(this.distance(e, t) / n) + Math.round(this.distance(e, r) / n) >> 1);
                switch (3 & a) {
                case 0:
                    a++;
                    break;
                case 2:
                    a--;
                    break;
                case 3:
                    throw "Error"
                }
                return a
            }
            ,
            this._bl = function(e, t, r, n) {
                var a = Math.floor(n * e)
                  , i = Math.max(0, t - a)
                  , n = Math.min(qrcode.width - 1, t + a);
                if (n - i < 3 * e)
                    throw "Error";
                t = Math.max(0, r - a),
                a = Math.min(qrcode.height - 1, r + a);
                return new _ak(this.image,i,t,n - i,a - t,e,this._am).find()
            }
            ,
            this.createTransform = function(e, t, r, n, a) {
                var i, o, _ = a - 3.5, n = a = null != n ? (i = n.X,
                o = n.Y,
                _ - 3) : (i = t.X - e.X + r.X,
                o = t.Y - e.Y + r.Y,
                _);
                return _ae._ag(3.5, 3.5, _, 3.5, n, a, 3.5, _, e.X, e.Y, t.X, t.Y, i, o, r.X, r.Y)
            }
            ,
            this._bz = function(e, t, r) {
                return _aa._af(e, r, t)
            }
            ,
            this._cd = function(e) {
                var t = e._gq
                  , r = e._gs
                  , n = e._gp
                  , a = this._bk(t, r, n);
                if (a < 1)
                    throw "Error";
                var i = this._bx(t, r, n, a)
                  , o = _a3._at(i)
                  , e = o._cr - 7
                  , _ = null;
                if (0 < o._as.length)
                    for (var o = r.X - t.X + n.X, h = r.Y - t.Y + n.Y, e = 1 - 3 / e, s = Math.floor(t.X + e * (o - t.X)), c = Math.floor(t.Y + e * (h - t.Y)), d = 4; d <= 16; d <<= 1) {
                        _ = this._bl(a, s, c, d);
                        break
                    }
                h = this.createTransform(t, r, n, _, i),
                i = this._bz(this.image, h, i),
                r = null == _ ? new Array(n,t,r) : new Array(n,t,r,_);
                return new _bg(i,r)
            }
            ,
            this.detect = function() {
                var e = (new _cc)._ce(this.image);
                return this._cd(e)
            }
        }
        _aa._ab = function(e, t) {
            for (var r = qrcode.width, n = qrcode.height, a = !0, i = 0; i < t.length && a; i += 2) {
                var o = Math.floor(t[i])
                  , _ = Math.floor(t[i + 1]);
                if (o < -1 || r < o || _ < -1 || n < _)
                    throw "Error._ab ";
                a = !1,
                -1 == o ? a = !(t[i] = 0) : o == r && (t[i] = r - 1,
                a = !0),
                -1 == _ ? a = !(t[i + 1] = 0) : _ == n && (t[i + 1] = n - 1,
                a = !0)
            }
            a = !0;
            for (i = t.length - 2; 0 <= i && a; i -= 2) {
                o = Math.floor(t[i]),
                _ = Math.floor(t[i + 1]);
                if (o < -1 || r < o || _ < -1 || n < _)
                    throw "Error._ab ";
                a = !1,
                -1 == o ? a = !(t[i] = 0) : o == r && (t[i] = r - 1,
                a = !0),
                -1 == _ ? a = !(t[i + 1] = 0) : _ == n && (t[i + 1] = n - 1,
                a = !0)
            }
        }
        ,
        _aa._af = function(e, t, r) {
            for (var n = new _ac(t), a = new Array(t << 1), i = 0; i < t; i++) {
                for (var o = a.length, _ = i + .5, h = 0; h < o; h += 2)
                    a[h] = .5 + (h >> 1),
                    a[h + 1] = _;
                r._ad(a),
                _aa._ab(e, a);
                try {
                    for (h = 0; h < o; h += 2)
                        e[Math.floor(a[h]) + qrcode.width * Math.floor(a[h + 1])] && n._dq(h >> 1, i)
                } catch (e) {
                    throw "Error._ab"
                }
            }
            return n
        }
        ,
        _aa._ah = function(e, t, r, n, a, i, o, _, h, s, c, d, w, f, u, l, g, v) {
            v = _ae._ag(r, n, a, i, o, _, h, s, c, d, w, f, u, l, g, v);
            return _aa._af(e, t, v)
        }
        ,
        _a3._bv = new Array(31892,34236,39577,42195,48118,51042,55367,58893,63784,68472,70749,76311,79154,84390,87683,92361,96236,102084,102881,110507,110734,117786,119615,126325,127568,133589,136944,141498,145311,150283,152622,158308,161089,167017),
        _a3.VERSIONS = _ay(),
        _a3._av = function(e) {
            if (e < 1 || 40 < e)
                throw "bad arguments";
            return _a3.VERSIONS[e - 1]
        }
        ,
        _a3._at = function(e) {
            if (e % 4 != 1)
                throw "Error _at";
            try {
                return _a3._av(e - 17 >> 2)
            } catch (e) {
                throw "Error _av"
            }
        }
        ,
        _a3._aw = function(e) {
            for (var t = 4294967295, r = 0, n = 0; n < _a3._bv.length; n++) {
                var a = _a3._bv[n];
                if (a == e)
                    return this._av(n + 7);
                a = _ax._gj(e, a);
                a < t && (r = n + 7,
                t = a)
            }
            return t <= 3 ? this._av(r) : null
        }
        ,
        _ae._ag = function(e, t, r, n, a, i, o, _, h, s, c, d, w, f, u, l) {
            _ = this._be(e, t, r, n, a, i, o, _);
            return this._bf(h, s, c, d, w, f, u, l).times(_)
        }
        ,
        _ae._bf = function(e, t, r, n, a, i, o, _) {
            var h = _ - i
              , s = t - n + i - _;
            if (0 == h && 0 == s)
                return new _ae(r - e,a - r,e,n - t,i - n,t,0,0,1);
            var c = r - a
              , d = o - a
              , w = e - r + a - o
              , a = n - i
              , i = c * h - d * a
              , d = (w * h - d * s) / i
              , i = (c * s - w * a) / i;
            return new _ae(r - e + d * r,o - e + i * o,e,n - t + d * n,_ - t + i * _,t,d,i,1)
        }
        ,
        _ae._be = function(e, t, r, n, a, i, o, _) {
            return this._bf(e, t, r, n, a, i, o, _)._fr()
        }
        ;
        var _ca = 21522
          , _cb = new Array(new Array(21522,0),new Array(20773,1),new Array(24188,2),new Array(23371,3),new Array(17913,4),new Array(16590,5),new Array(20375,6),new Array(19104,7),new Array(30660,8),new Array(29427,9),new Array(32170,10),new Array(30877,11),new Array(26159,12),new Array(25368,13),new Array(27713,14),new Array(26998,15),new Array(5769,16),new Array(5054,17),new Array(7399,18),new Array(6608,19),new Array(1890,20),new Array(597,21),new Array(3340,22),new Array(2107,23),new Array(13663,24),new Array(12392,25),new Array(16177,26),new Array(14854,27),new Array(9396,28),new Array(8579,29),new Array(11994,30),new Array(11245,31))
          , _ch = new Array(0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4);
        function _ax(e) {
            this._cf = _cg.forBits(e >> 3 & 3),
            this._fe = 7 & e,
            this.__defineGetter__("_cg", function() {
                return this._cf
            }),
            this.__defineGetter__("_dx", function() {
                return this._fe
            }),
            this.GetHashCode = function() {
                return this._cf.ordinal() << 3 | this._fe
            }
            ,
            this.Equals = function(e) {
                return this._cf == e._cf && this._fe == e._fe
            }
        }
        function _cg(e, t, r) {
            this._ff = e,
            this.bits = t,
            this.name = r,
            this.__defineGetter__("Bits", function() {
                return this.bits
            }),
            this.__defineGetter__("Name", function() {
                return this.name
            }),
            this.ordinal = function() {
                return this._ff
            }
        }
        _ax._gj = function(e, t) {
            return _ch[15 & (e ^= t)] + _ch[15 & _ew(e, 4)] + _ch[15 & _ew(e, 8)] + _ch[15 & _ew(e, 12)] + _ch[15 & _ew(e, 16)] + _ch[15 & _ew(e, 20)] + _ch[15 & _ew(e, 24)] + _ch[15 & _ew(e, 28)]
        }
        ,
        _ax._ci = function(e) {
            var t = _ax._cj(e);
            return null != t ? t : _ax._cj(e ^ _ca)
        }
        ,
        _ax._cj = function(e) {
            for (var t = 4294967295, r = 0, n = 0; n < _cb.length; n++) {
                var a = _cb[n]
                  , i = a[0];
                if (i == e)
                    return new _ax(a[1]);
                i = this._gj(e, i);
                i < t && (r = a[1],
                t = i)
            }
            return t <= 3 ? new _ax(r) : null
        }
        ,
        _cg.forBits = function(e) {
            if (e < 0 || e >= FOR_BITS.length)
                throw "bad arguments";
            return FOR_BITS[e]
        }
        ;
        var L = new _cg(0,1,"L")
          , M = new _cg(1,0,"M")
          , Q = new _cg(2,3,"Q")
          , H = new _cg(3,2,"H")
          , FOR_BITS = new Array(M,L,H,Q);
        function _ac(e, t) {
            if (t = t || e,
            e < 1 || t < 1)
                throw "Both dimensions must be greater than 0";
            this.width = e,
            this.height = t;
            var r = e >> 5;
            0 != (31 & e) && r++,
            this.rowSize = r,
            this.bits = new Array(r * t);
            for (var n = 0; n < this.bits.length; n++)
                this.bits[n] = 0;
            this.__defineGetter__("Width", function() {
                return this.width
            }),
            this.__defineGetter__("Height", function() {
                return this.height
            }),
            this.__defineGetter__("Dimension", function() {
                if (this.width != this.height)
                    throw "Can't call getDimension() on a non-square matrix";
                return this.width
            }),
            this._ds = function(e, t) {
                t = t * this.rowSize + (e >> 5);
                return 0 != (1 & _ew(this.bits[t], 31 & e))
            }
            ,
            this._dq = function(e, t) {
                t = t * this.rowSize + (e >> 5);
                this.bits[t] |= 1 << (31 & e)
            }
            ,
            this.flip = function(e, t) {
                t = t * this.rowSize + (e >> 5);
                this.bits[t] ^= 1 << (31 & e)
            }
            ,
            this.clear = function() {
                for (var e = this.bits.length, t = 0; t < e; t++)
                    this.bits[t] = 0
            }
            ,
            this._bq = function(e, t, r, n) {
                if (t < 0 || e < 0)
                    throw "Left and top must be nonnegative";
                if (n < 1 || r < 1)
                    throw "Height and width must be at least 1";
                var a = e + r
                  , i = t + n;
                if (i > this.height || a > this.width)
                    throw "The region must fit inside the matrix";
                for (var o = t; o < i; o++)
                    for (var _ = o * this.rowSize, h = e; h < a; h++)
                        this.bits[_ + (h >> 5)] |= 1 << (31 & h)
            }
        }
        function _dl(e, t) {
            this._dv = e,
            this._dw = t,
            this.__defineGetter__("_du", function() {
                return this._dv
            }),
            this.__defineGetter__("Codewords", function() {
                return this._dw
            })
        }
        function _cl(e) {
            var t = e.Dimension;
            if (t < 21 || 1 != (3 & t))
                throw "Error _cl";
            this._au = e,
            this._cp = null,
            this._co = null,
            this._dk = function(e, t, r) {
                return this._au._ds(e, t) ? r << 1 | 1 : r << 1
            }
            ,
            this._cm = function() {
                if (null != this._co)
                    return this._co;
                for (var e = 0, t = 0; t < 6; t++)
                    e = this._dk(t, 8, e);
                e = this._dk(7, 8, e),
                e = this._dk(8, 8, e),
                e = this._dk(8, 7, e);
                for (var r = 5; 0 <= r; r--)
                    e = this._dk(8, r, e);
                if (this._co = _ax._ci(e),
                null != this._co)
                    return this._co;
                for (var n = this._au.Dimension, e = 0, a = n - 8, t = n - 1; a <= t; t--)
                    e = this._dk(t, 8, e);
                for (r = n - 7; r < n; r++)
                    e = this._dk(8, r, e);
                if (this._co = _ax._ci(e),
                null != this._co)
                    return this._co;
                throw "Error _cm"
            }
            ,
            this._cq = function() {
                if (null != this._cp)
                    return this._cp;
                var e = this._au.Dimension
                  , t = e - 17 >> 2;
                if (t <= 6)
                    return _a3._av(t);
                for (var r = 0, n = e - 11, a = 5; 0 <= a; a--)
                    for (var i = e - 9; n <= i; i--)
                        r = this._dk(i, a, r);
                if (this._cp = _a3._aw(r),
                null != this._cp && this._cp._cr == e)
                    return this._cp;
                r = 0;
                for (i = 5; 0 <= i; i--)
                    for (a = e - 9; n <= a; a--)
                        r = this._dk(i, a, r);
                if (this._cp = _a3._aw(r),
                null != this._cp && this._cp._cr == e)
                    return this._cp;
                throw "Error _cq"
            }
            ,
            this._gk = function() {
                var e = this._cm()
                  , t = this._cq()
                  , e = _dx._gl(e._dx)
                  , r = this._au.Dimension;
                e._dj(this._au, r);
                for (var n = t._aq(), a = !0, i = new Array(t._dp), o = 0, _ = 0, h = 0, s = r - 1; 0 < s; s -= 2) {
                    6 == s && s--;
                    for (var c = 0; c < r; c++)
                        for (var d = a ? r - 1 - c : c, w = 0; w < 2; w++)
                            n._ds(s - w, d) || (h++,
                            _ <<= 1,
                            this._au._ds(s - w, d) && (_ |= 1),
                            8 == h && (i[o++] = _,
                            _ = h = 0));
                    a ^= !0
                }
                if (o != t._dp)
                    throw "Error _gk";
                return i
            }
        }
        _dl._gn = function(e, t, r) {
            if (e.length != t._dp)
                throw "bad arguments";
            for (var n = t._bu(r), a = 0, i = n._fb(), o = 0; o < i.length; o++)
                a += i[o].Count;
            for (var _ = new Array(a), h = 0, s = 0; s < i.length; s++)
                for (var c = i[s], o = 0; o < c.Count; o++) {
                    var d = c._dm
                      , w = n._bo + d;
                    _[h++] = new _dl(d,new Array(w))
                }
            for (var f = _[0]._dw.length, u = _.length - 1; 0 <= u; ) {
                if (_[u]._dw.length == f)
                    break;
                u--
            }
            u++;
            for (var l = f - n._bo, g = 0, o = 0; o < l; o++)
                for (s = 0; s < h; s++)
                    _[s]._dw[o] = e[g++];
            for (s = u; s < h; s++)
                _[s]._dw[l] = e[g++];
            for (var v = _[0]._dw.length, o = l; o < v; o++)
                for (s = 0; s < h; s++) {
                    var m = s < u ? o : o + 1;
                    _[s]._dw[m] = e[g++]
                }
            return _
        }
        ;
        var _dx = {};
        function _fg() {
            this._dj = function(e, t) {
                for (var r = 0; r < t; r++)
                    for (var n = 0; n < t; n++)
                        this._fw(r, n) && e.flip(n, r)
            }
            ,
            this._fw = function(e, t) {
                return 0 == (e + t & 1)
            }
        }
        function _fh() {
            this._dj = function(e, t) {
                for (var r = 0; r < t; r++)
                    for (var n = 0; n < t; n++)
                        this._fw(r, n) && e.flip(n, r)
            }
            ,
            this._fw = function(e, t) {
                return 0 == (1 & e)
            }
        }
        function _fi() {
            this._dj = function(e, t) {
                for (var r = 0; r < t; r++)
                    for (var n = 0; n < t; n++)
                        this._fw(r, n) && e.flip(n, r)
            }
            ,
            this._fw = function(e, t) {
                return t % 3 == 0
            }
        }
        function _fj() {
            this._dj = function(e, t) {
                for (var r = 0; r < t; r++)
                    for (var n = 0; n < t; n++)
                        this._fw(r, n) && e.flip(n, r)
            }
            ,
            this._fw = function(e, t) {
                return (e + t) % 3 == 0
            }
        }
        function _fk() {
            this._dj = function(e, t) {
                for (var r = 0; r < t; r++)
                    for (var n = 0; n < t; n++)
                        this._fw(r, n) && e.flip(n, r)
            }
            ,
            this._fw = function(e, t) {
                return 0 == (_ew(e, 1) + t / 3 & 1)
            }
        }
        function _fl() {
            this._dj = function(e, t) {
                for (var r = 0; r < t; r++)
                    for (var n = 0; n < t; n++)
                        this._fw(r, n) && e.flip(n, r)
            }
            ,
            this._fw = function(e, t) {
                t *= e;
                return (1 & t) + t % 3 == 0
            }
        }
        function _fm() {
            this._dj = function(e, t) {
                for (var r = 0; r < t; r++)
                    for (var n = 0; n < t; n++)
                        this._fw(r, n) && e.flip(n, r)
            }
            ,
            this._fw = function(e, t) {
                t *= e;
                return 0 == ((1 & t) + t % 3 & 1)
            }
        }
        function _fn() {
            this._dj = function(e, t) {
                for (var r = 0; r < t; r++)
                    for (var n = 0; n < t; n++)
                        this._fw(r, n) && e.flip(n, r)
            }
            ,
            this._fw = function(e, t) {
                return 0 == ((e + t & 1) + e * t % 3 & 1)
            }
        }
        function _db(e) {
            this._fa = e,
            this.decode = function(e, t) {
                for (var r = new _bp(this._fa,e), n = new Array(t), a = 0; a < n.length; a++)
                    n[a] = 0;
                for (var i = !0, a = 0; a < t; a++) {
                    var o = r.evaluateAt(this._fa.exp(a));
                    0 != (n[n.length - 1 - a] = o) && (i = !1)
                }
                if (!i)
                    for (var _ = new _bp(this._fa,n), h = this._eb(this._fa._ba(t, 1), _, t), _ = h[0], h = h[1], s = this._ey(_), c = this._di(h, s, !1), a = 0; a < s.length; a++) {
                        var d = e.length - 1 - this._fa.log(s[a]);
                        if (d < 0)
                            throw "ReedSolomonException Bad error location";
                        e[d] = _az._bd(e[d], c[a])
                    }
            }
            ,
            this._eb = function(e, t, r) {
                var n;
                e._ec < t._ec && (n = e,
                e = t,
                t = n);
                for (var a = e, i = t, o = this._fa.One, _ = this._fa.Zero, h = this._fa.Zero, s = this._fa.One; i._ec >= Math.floor(r / 2); ) {
                    var c = a
                      , d = o
                      , w = h
                      , o = _
                      , h = s;
                    if ((a = i).Zero)
                        throw "r_{i-1} was zero";
                    i = c;
                    for (var f = this._fa.Zero, c = a._ex(a._ec), u = this._fa.inverse(c); i._ec >= a._ec && !i.Zero; )
                        var l = i._ec - a._ec
                          , g = this._fa.multiply(i._ex(i._ec), u)
                          , f = f._bd(this._fa._ba(l, g))
                          , i = i._bd(a._dc(l, g));
                    _ = f.multiply1(o)._bd(d),
                    s = f.multiply1(h)._bd(w)
                }
                e = s._ex(0);
                if (0 == e)
                    throw "ReedSolomonException sigmaTilde(0) was zero";
                t = this._fa.inverse(e),
                e = s.multiply2(t),
                t = i.multiply2(t);
                return new Array(e,t)
            }
            ,
            this._ey = function(e) {
                var t = e._ec;
                if (1 == t)
                    return new Array(e._ex(1));
                for (var r = new Array(t), n = 0, a = 1; a < 256 && n < t; a++)
                    0 == e.evaluateAt(a) && (r[n] = this._fa.inverse(a),
                    n++);
                if (n != t)
                    throw "Error locator degree does not match number of roots";
                return r
            }
            ,
            this._di = function(e, t, r) {
                for (var n = t.length, a = new Array(n), i = 0; i < n; i++) {
                    for (var o = this._fa.inverse(t[i]), _ = 1, h = 0; h < n; h++)
                        i != h && (_ = this._fa.multiply(_, _az._bd(1, this._fa.multiply(t[h], o))));
                    a[i] = this._fa.multiply(e.evaluateAt(o), this._fa.inverse(_)),
                    r && (a[i] = this._fa.multiply(a[i], o))
                }
                return a
            }
        }
        function _bp(_, e) {
            if (null == e || 0 == e.length)
                throw "bad arguments";
            this._fa = _;
            var t = e.length;
            if (1 < t && 0 == e[0]) {
                for (var r = 1; r < t && 0 == e[r]; )
                    r++;
                if (r == t)
                    this._dd = _.Zero._dd;
                else {
                    this._dd = new Array(t - r);
                    for (var n = 0; n < this._dd.length; n++)
                        this._dd[n] = 0;
                    for (var a = 0; a < this._dd.length; a++)
                        this._dd[a] = e[r + a]
                }
            } else
                this._dd = e;
            this.__defineGetter__("Zero", function() {
                return 0 == this._dd[0]
            }),
            this.__defineGetter__("_ec", function() {
                return this._dd.length - 1
            }),
            this.__defineGetter__("Coefficients", function() {
                return this._dd
            }),
            this._ex = function(e) {
                return this._dd[this._dd.length - 1 - e]
            }
            ,
            this.evaluateAt = function(e) {
                if (0 == e)
                    return this._ex(0);
                var t = this._dd.length;
                if (1 == e) {
                    for (var r = 0, n = 0; n < t; n++)
                        r = _az._bd(r, this._dd[n]);
                    return r
                }
                for (var a = this._dd[0], n = 1; n < t; n++)
                    a = _az._bd(this._fa.multiply(e, a), this._dd[n]);
                return a
            }
            ,
            this._bd = function(e) {
                if (this._fa != e._fa)
                    throw "GF256Polys do not have same _az _fa";
                if (this.Zero)
                    return e;
                if (e.Zero)
                    return this;
                var t = this._dd
                  , r = e._dd;
                t.length > r.length && (e = t,
                t = r,
                r = e);
                for (var n = new Array(r.length), a = r.length - t.length, i = 0; i < a; i++)
                    n[i] = r[i];
                for (var o = a; o < r.length; o++)
                    n[o] = _az._bd(t[o - a], r[o]);
                return new _bp(_,n)
            }
            ,
            this.multiply1 = function(e) {
                if (this._fa != e._fa)
                    throw "GF256Polys do not have same _az _fa";
                if (this.Zero || e.Zero)
                    return this._fa.Zero;
                for (var t = this._dd, r = t.length, n = e._dd, a = n.length, i = new Array(r + a - 1), o = 0; o < r; o++)
                    for (var _ = t[o], h = 0; h < a; h++)
                        i[o + h] = _az._bd(i[o + h], this._fa.multiply(_, n[h]));
                return new _bp(this._fa,i)
            }
            ,
            this.multiply2 = function(e) {
                if (0 == e)
                    return this._fa.Zero;
                if (1 == e)
                    return this;
                for (var t = this._dd.length, r = new Array(t), n = 0; n < t; n++)
                    r[n] = this._fa.multiply(this._dd[n], e);
                return new _bp(this._fa,r)
            }
            ,
            this._dc = function(e, t) {
                if (e < 0)
                    throw "bad arguments";
                if (0 == t)
                    return this._fa.Zero;
                for (var r = this._dd.length, n = new Array(r + e), a = 0; a < n.length; a++)
                    n[a] = 0;
                for (a = 0; a < r; a++)
                    n[a] = this._fa.multiply(this._dd[a], t);
                return new _bp(this._fa,n)
            }
            ,
            this.divide = function(e) {
                if (this._fa != e._fa)
                    throw "GF256Polys do not have same _az _fa";
                if (e.Zero)
                    throw "Divide by 0";
                for (var t = this._fa.Zero, r = this, n = e._ex(e._ec), a = this._fa.inverse(n); r._ec >= e._ec && !r.Zero; )
                    var i = r._ec - e._ec
                      , o = this._fa.multiply(r._ex(r._ec), a)
                      , _ = e._dc(i, o)
                      , o = this._fa._ba(i, o)
                      , t = t._bd(o)
                      , r = r._bd(_);
                return new Array(t,r)
            }
        }
        function _az(e) {
            this._gh = new Array(256),
            this._gi = new Array(256);
            for (var t = 1, r = 0; r < 256; r++)
                this._gh[r] = t,
                256 <= (t <<= 1) && (t ^= e);
            for (r = 0; r < 255; r++)
                this._gi[this._gh[r]] = r;
            var n = new Array(1);
            n[0] = 0,
            this.zero = new _bp(this,new Array(n));
            n = new Array(1);
            n[0] = 1,
            this.one = new _bp(this,new Array(n)),
            this.__defineGetter__("Zero", function() {
                return this.zero
            }),
            this.__defineGetter__("One", function() {
                return this.one
            }),
            this._ba = function(e, t) {
                if (e < 0)
                    throw "bad arguments";
                if (0 == t)
                    return this.zero;
                for (var r = new Array(e + 1), n = 0; n < r.length; n++)
                    r[n] = 0;
                return r[0] = t,
                new _bp(this,r)
            }
            ,
            this.exp = function(e) {
                return this._gh[e]
            }
            ,
            this.log = function(e) {
                if (0 == e)
                    throw "bad arguments";
                return this._gi[e]
            }
            ,
            this.inverse = function(e) {
                if (0 == e)
                    throw "System.ArithmeticException";
                return this._gh[255 - this._gi[e]]
            }
            ,
            this.multiply = function(e, t) {
                return 0 == e || 0 == t ? 0 : 1 == e ? t : 1 == t ? e : this._gh[(this._gi[e] + this._gi[t]) % 255]
            }
        }
        _dx._gl = function(e) {
            if (e < 0 || 7 < e)
                throw "bad arguments";
            return _dx._dy[e]
        }
        ,
        _dx._dy = new Array(new _fg,new _fh,new _fi,new _fj,new _fk,new _fl,new _fm,new _fn),
        _az._bb = new _az(285),
        _az._bc = new _az(301),
        _az._bd = function(e, t) {
            return e ^ t
        }
        ;
        var Decoder = {};
        Decoder.rsDecoder = new _db(_az._bb),
        Decoder.correctErrors = function(e, t) {
            for (var r = e.length, n = new Array(r), a = 0; a < r; a++)
                n[a] = 255 & e[a];
            var i = e.length - t;
            try {
                Decoder.rsDecoder.decode(n, i)
            } catch (e) {
                throw e
            }
            for (a = 0; a < t; a++)
                e[a] = n[a]
        }
        ,
        Decoder.decode = function(e) {
            for (var t = new _cl(e), r = t._cq(), e = t._cm()._cg, t = t._gk(), n = _dl._gn(t, r, e), a = 0, i = 0; i < n.length; i++)
                a += n[i]._du;
            for (var o = new Array(a), _ = 0, h = 0; h < n.length; h++) {
                var s = n[h]
                  , c = s.Codewords
                  , d = s._du;
                Decoder.correctErrors(c, d);
                for (i = 0; i < d; i++)
                    o[_++] = c[i]
            }
            return new QRCodeDataBlockReader(o,r._fd,e.Bits)
        }
        ;
        var qrcode = {};
        function _ew(e, t) {
            return 0 <= e ? e >> t : (e >> t) + (2 << ~t)
        }
        qrcode.imagedata = null,
        qrcode.width = 0,
        qrcode.height = 0,
        qrcode.qrCodeSymbol = null,
        qrcode.debug = !1,
        qrcode.maxImgSize = 1048576,
        qrcode._eo = [[10, 9, 8, 8], [12, 11, 16, 10], [14, 13, 16, 12]],
        qrcode.callback = null,
        qrcode.vidSuccess = function(e) {
            qrcode.localstream = e,
            qrcode.webkit ? qrcode.video.src = window.webkitURL.createObjectURL(e) : qrcode.moz ? (qrcode.video.mozSrcObject = e,
            qrcode.video.play()) : qrcode.video.src = e,
            qrcode.gUM = !0,
            qrcode.canvas_qr2 = document.createElement("canvas"),
            qrcode.canvas_qr2.id = "qr-canvas",
            qrcode.qrcontext2 = qrcode.canvas_qr2.getContext("2d"),
            qrcode.canvas_qr2.width = qrcode.video.videoWidth,
            qrcode.canvas_qr2.height = qrcode.video.videoHeight,
            setTimeout(qrcode.captureToCanvas, 500)
        }
        ,
        qrcode.vidError = function(e) {
            qrcode.gUM = !1
        }
        ,
        qrcode.captureToCanvas = function() {
            if (qrcode.gUM)
                try {
                    if (0 == qrcode.video.videoWidth)
                        return void setTimeout(qrcode.captureToCanvas, 500);
                    qrcode.canvas_qr2.width = qrcode.video.videoWidth,
                    qrcode.canvas_qr2.height = qrcode.video.videoHeight,
                    qrcode.qrcontext2.drawImage(qrcode.video, 0, 0);
                    try {
                        qrcode.decode()
                    } catch (e) {
                        console.log(e),
                        setTimeout(qrcode.captureToCanvas, 500)
                    }
                } catch (e) {
                    console.log(e),
                    setTimeout(qrcode.captureToCanvas, 500)
                }
        }
        ,
        qrcode.setWebcam = function(e) {
            var t = navigator;
            qrcode.video = document.getElementById(e);
            var r = !0;
            if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices)
                try {
                    navigator.mediaDevices.enumerateDevices().then(function(e) {
                        e.forEach(function(e) {
                            console.log("deb1"),
                            "videoinput" === e.kind && -1 < e.label.toLowerCase().search("back") && (r = [{
                                sourceId: e.deviceId
                            }]),
                            console.log(e.kind + ": " + e.label + " id = " + e.deviceId)
                        })
                    })
                } catch (e) {
                    console.log(e)
                }
            else
                console.log("no navigator.mediaDevices.enumerateDevices");
            t.getUserMedia ? t.getUserMedia({
                video: r,
                audio: !1
            }, qrcode.vidSuccess, qrcode.vidError) : t.webkitGetUserMedia ? (qrcode.webkit = !0,
            t.webkitGetUserMedia({
                video: r,
                audio: !1
            }, qrcode.vidSuccess, qrcode.vidError)) : t.mozGetUserMedia && (qrcode.moz = !0,
            t.mozGetUserMedia({
                video: r,
                audio: !1
            }, qrcode.vidSuccess, qrcode.vidError))
        }
        ,
        qrcode.decode = function(e) {
            var t, r;
            if (0 == arguments.length)
                return r = qrcode.canvas_qr2 ? (t = qrcode.canvas_qr2,
                qrcode.qrcontext2) : (t = document.getElementById("qr-canvas")).getContext("2d"),
                qrcode.width = t.width,
                qrcode.height = t.height,
                qrcode.imagedata = r.getImageData(0, 0, qrcode.width, qrcode.height),
                qrcode.result = qrcode.process(r),
                null != qrcode.callback && qrcode.callback(qrcode.result),
                qrcode.result;
            var i = new Image;
            i.crossOrigin = "Anonymous",
            i.onload = function() {
                var e = document.getElementById("out-canvas");
                null != e && ((t = e.getContext("2d")).clearRect(0, 0, 320, 240),
                t.drawImage(i, 0, 0, 320, 240));
                var t, r = document.createElement("canvas"), n = r.getContext("2d"), a = i.height, e = i.width;
                i.width * i.height > qrcode.maxImgSize && (e = (t = i.width / i.height) * (a = Math.sqrt(qrcode.maxImgSize / t))),
                r.width = e,
                r.height = a,
                n.drawImage(i, 0, 0, r.width, r.height),
                qrcode.width = r.width,
                qrcode.height = r.height;
                try {
                    qrcode.imagedata = n.getImageData(0, 0, r.width, r.height)
                } catch (e) {
                    return qrcode.result = "Cross domain image reading not supported in your browser! Save it to your computer then drag and drop the file!",
                    void (null != qrcode.callback && qrcode.callback(qrcode.result))
                }
                try {
                    qrcode.result = qrcode.process(n)
                } catch (e) {
                    console.log(e),
                    qrcode.result = "error decoding QR Code"
                }
                null != qrcode.callback && qrcode.callback(qrcode.result)
            }
            ,
            i.onerror = function() {
                null != qrcode.callback && qrcode.callback("Failed to load the image")
            }
            ,
            i.src = e
        }
        ,
        qrcode.isUrl = function(e) {
            return /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(e)
        }
        ,
        qrcode.decode_url = function(t) {
            var r = "";
            try {
                r = escape(t)
            } catch (e) {
                console.log(e),
                r = t
            }
            var n = "";
            try {
                n = decodeURIComponent(r)
            } catch (e) {
                console.log(e),
                n = r
            }
            return n
        }
        ,
        qrcode.decode_utf8 = function(e) {
            return qrcode.isUrl(e) ? qrcode.decode_url(e) : e
        }
        ,
        qrcode.process = function(e) {
            var t = (new Date).getTime()
              , r = qrcode.grayScaleToBitmap(qrcode.grayscale());
            if (qrcode.debug) {
                for (var n = 0; n < qrcode.height; n++)
                    for (var a = 0; a < qrcode.width; a++) {
                        var i = 4 * a + n * qrcode.width * 4;
                        qrcode.imagedata.data[i] = (r[a + n * qrcode.width],
                        0),
                        qrcode.imagedata.data[i + 1] = (r[a + n * qrcode.width],
                        0),
                        qrcode.imagedata.data[i + 2] = r[a + n * qrcode.width] ? 255 : 0
                    }
                e.putImageData(qrcode.imagedata, 0, 0)
            }
            var o = new Detector(r).detect();
            if (qrcode.debug) {
                for (n = 0; n < o.bits.Height; n++)
                    for (a = 0; a < o.bits.Width; a++) {
                        i = 4 * a * 2 + 2 * n * qrcode.width * 4;
                        qrcode.imagedata.data[i] = (o.bits._ds(a, n),
                        0),
                        qrcode.imagedata.data[i + 1] = (o.bits._ds(a, n),
                        0),
                        qrcode.imagedata.data[i + 2] = o.bits._ds(a, n) ? 255 : 0
                    }
                e.putImageData(qrcode.imagedata, 0, 0)
            }
            for (var _ = Decoder.decode(o.bits).DataByte, h = "", s = 0; s < _.length; s++)
                for (var c = 0; c < _[s].length; c++)
                    h += String.fromCharCode(_[s][c]);
            t = (new Date).getTime() - t;
            return console.log(t),
            qrcode.decode_utf8(h)
        }
        ,
        qrcode.getPixel = function(e, t) {
            if (qrcode.width < e)
                throw "point error";
            if (qrcode.height < t)
                throw "point error";
            t = 4 * e + t * qrcode.width * 4;
            return (33 * qrcode.imagedata.data[t] + 34 * qrcode.imagedata.data[1 + t] + 33 * qrcode.imagedata.data[2 + t]) / 100
        }
        ,
        qrcode.binarize = function(e) {
            for (var t = new Array(qrcode.width * qrcode.height), r = 0; r < qrcode.height; r++)
                for (var n = 0; n < qrcode.width; n++) {
                    var a = qrcode.getPixel(n, r);
                    t[n + r * qrcode.width] = a <= e
                }
            return t
        }
        ,
        qrcode._em = function(e) {
            for (var t = Math.floor(qrcode.width / 4), r = Math.floor(qrcode.height / 4), n = new Array(4), a = 0; a < 4; a++) {
                n[a] = new Array(4);
                for (var i = 0; i < 4; i++)
                    n[a][i] = new Array(0,0)
            }
            for (var o = 0; o < 4; o++)
                for (var _ = 0; _ < 4; _++) {
                    n[_][o][0] = 255;
                    for (var h = 0; h < r; h++)
                        for (var s = 0; s < t; s++) {
                            var c = e[t * _ + s + (r * o + h) * qrcode.width];
                            c < n[_][o][0] && (n[_][o][0] = c),
                            c > n[_][o][1] && (n[_][o][1] = c)
                        }
                }
            for (var d = new Array(4), w = 0; w < 4; w++)
                d[w] = new Array(4);
            for (o = 0; o < 4; o++)
                for (_ = 0; _ < 4; _++)
                    d[_][o] = Math.floor((n[_][o][0] + n[_][o][1]) / 2);
            return d
        }
        ,
        qrcode.grayScaleToBitmap = function(e) {
            for (var t = qrcode._em(e), r = t.length, n = Math.floor(qrcode.width / r), a = Math.floor(qrcode.height / r), i = new ArrayBuffer(qrcode.width * qrcode.height), o = new Uint8Array(i), _ = 0; _ < r; _++)
                for (var h = 0; h < r; h++)
                    for (var s = 0; s < a; s++)
                        for (var c = 0; c < n; c++)
                            o[n * h + c + (a * _ + s) * qrcode.width] = e[n * h + c + (a * _ + s) * qrcode.width] < t[h][_];
            return o
        }
        ,
        qrcode.grayscale = function() {
            for (var e = new ArrayBuffer(qrcode.width * qrcode.height), t = new Uint8Array(e), r = 0; r < qrcode.height; r++)
                for (var n = 0; n < qrcode.width; n++) {
                    var a = qrcode.getPixel(n, r);
                    t[n + r * qrcode.width] = a
                }
            return t
        }
        ;
        var _gf = 3
          , _eh = 57
          , _el = 8
          , _eg = 2;
        function _cz(e, t, r) {
            this.x = e,
            this.y = t,
            this.count = 1,
            this._aj = r,
            this.__defineGetter__("_ei", function() {
                return this._aj
            }),
            this.__defineGetter__("Count", function() {
                return this.count
            }),
            this.__defineGetter__("X", function() {
                return this.x
            }),
            this.__defineGetter__("Y", function() {
                return this.y
            }),
            this._ek = function() {
                this.count++
            }
            ,
            this._ev = function(e, t, r) {
                if (Math.abs(t - this.y) <= e && Math.abs(r - this.x) <= e) {
                    e = Math.abs(e - this._aj);
                    return e <= 1 || e / this._aj <= 1
                }
                return !1
            }
        }
        function _es(e) {
            this._go = e[0],
            this._gu = e[1],
            this._gr = e[2],
            this.__defineGetter__("_gp", function() {
                return this._go
            }),
            this.__defineGetter__("_gq", function() {
                return this._gu
            }),
            this.__defineGetter__("_gs", function() {
                return this._gr
            })
        }
        function _cc() {
            this.image = null,
            this._cv = [],
            this._ge = !1,
            this._al = new Array(0,0,0,0,0),
            this._am = null,
            this.__defineGetter__("_da", function() {
                return this._al[0] = 0,
                this._al[1] = 0,
                this._al[2] = 0,
                this._al[3] = 0,
                this._al[4] = 0,
                this._al
            }),
            this._ao = function(e) {
                for (var t = 0, r = 0; r < 5; r++) {
                    var n = e[r];
                    if (0 == n)
                        return !1;
                    t += n
                }
                if (t < 7)
                    return !1;
                var a = Math.floor((t << _el) / 7)
                  , i = Math.floor(a / 2);
                return Math.abs(a - (e[0] << _el)) < i && Math.abs(a - (e[1] << _el)) < i && Math.abs(3 * a - (e[2] << _el)) < 3 * i && Math.abs(a - (e[3] << _el)) < i && Math.abs(a - (e[4] << _el)) < i
            }
            ,
            this._an = function(e, t) {
                return t - e[4] - e[3] - e[2] / 2
            }
            ,
            this._ap = function(e, t, r, n) {
                for (var a = this.image, i = qrcode.height, o = this._da, _ = e; 0 <= _ && a[t + _ * qrcode.width]; )
                    o[2]++,
                    _--;
                if (_ < 0)
                    return NaN;
                for (; 0 <= _ && !a[t + _ * qrcode.width] && o[1] <= r; )
                    o[1]++,
                    _--;
                if (_ < 0 || o[1] > r)
                    return NaN;
                for (; 0 <= _ && a[t + _ * qrcode.width] && o[0] <= r; )
                    o[0]++,
                    _--;
                if (o[0] > r)
                    return NaN;
                for (_ = e + 1; _ < i && a[t + _ * qrcode.width]; )
                    o[2]++,
                    _++;
                if (_ == i)
                    return NaN;
                for (; _ < i && !a[t + _ * qrcode.width] && o[3] < r; )
                    o[3]++,
                    _++;
                if (_ == i || o[3] >= r)
                    return NaN;
                for (; _ < i && a[t + _ * qrcode.width] && o[4] < r; )
                    o[4]++,
                    _++;
                if (o[4] >= r)
                    return NaN;
                e = o[0] + o[1] + o[2] + o[3] + o[4];
                return !(5 * Math.abs(e - n) >= 2 * n) && this._ao(o) ? this._an(o, _) : NaN
            }
            ,
            this._ej = function(e, t, r, n) {
                for (var a = this.image, i = qrcode.width, o = this._da, _ = e; 0 <= _ && a[_ + t * qrcode.width]; )
                    o[2]++,
                    _--;
                if (_ < 0)
                    return NaN;
                for (; 0 <= _ && !a[_ + t * qrcode.width] && o[1] <= r; )
                    o[1]++,
                    _--;
                if (_ < 0 || o[1] > r)
                    return NaN;
                for (; 0 <= _ && a[_ + t * qrcode.width] && o[0] <= r; )
                    o[0]++,
                    _--;
                if (o[0] > r)
                    return NaN;
                for (_ = e + 1; _ < i && a[_ + t * qrcode.width]; )
                    o[2]++,
                    _++;
                if (_ == i)
                    return NaN;
                for (; _ < i && !a[_ + t * qrcode.width] && o[3] < r; )
                    o[3]++,
                    _++;
                if (_ == i || o[3] >= r)
                    return NaN;
                for (; _ < i && a[_ + t * qrcode.width] && o[4] < r; )
                    o[4]++,
                    _++;
                if (o[4] >= r)
                    return NaN;
                e = o[0] + o[1] + o[2] + o[3] + o[4];
                return !(5 * Math.abs(e - n) >= n) && this._ao(o) ? this._an(o, _) : NaN
            }
            ,
            this._cu = function(e, t, r) {
                var n = e[0] + e[1] + e[2] + e[3] + e[4]
                  , a = this._an(e, r)
                  , i = this._ap(t, Math.floor(a), e[2], n);
                if (isNaN(i) || (a = this._ej(Math.floor(a), Math.floor(i), e[2], n),
                isNaN(a)))
                    return !1;
                for (var o = n / 7, _ = !1, h = this._cv.length, s = 0; s < h; s++) {
                    var c = this._cv[s];
                    if (c._ev(o, i, a)) {
                        c._ek(),
                        _ = !0;
                        break
                    }
                }
                return _ || (n = new _cz(a,i,o),
                this._cv.push(n),
                null != this._am && this._am._ep(n)),
                !0
            }
            ,
            this._ee = function() {
                var e = this._cv.length;
                if (e < 3)
                    throw "Couldn't find enough finder patterns (found " + e + ")";
                if (3 < e) {
                    for (var t = 0, r = 0, n = 0; n < e; n++) {
                        var a = this._cv[n]._ei;
                        t += a,
                        r += a * a
                    }
                    var i = t / e;
                    this._cv.sort(function(e, t) {
                        t = Math.abs(t._ei - i),
                        e = Math.abs(e._ei - i);
                        return t < e ? -1 : t == e ? 0 : 1
                    });
                    for (var o = Math.sqrt(r / e - i * i), _ = Math.max(.2 * i, o), n = this._cv.length - 1; 0 <= n; n--) {
                        var h = this._cv[n];
                        Math.abs(h._ei - i) > _ && this._cv.splice(n, 1)
                    }
                }
                return 3 < this._cv.length && this._cv.sort(function(e, t) {
                    return e.count > t.count ? -1 : e.count < t.count ? 1 : 0
                }),
                new Array(this._cv[0],this._cv[1],this._cv[2])
            }
            ,
            this._eq = function() {
                var e = this._cv.length;
                if (e <= 1)
                    return 0;
                for (var t = null, r = 0; r < e; r++) {
                    var n = this._cv[r];
                    if (n.Count >= _eg) {
                        if (null != t)
                            return this._ge = !0,
                            Math.floor((Math.abs(t.X - n.X) - Math.abs(t.Y - n.Y)) / 2);
                        t = n
                    }
                }
                return 0
            }
            ,
            this._cx = function() {
                for (var e = 0, t = 0, r = this._cv.length, n = 0; n < r; n++) {
                    var a = this._cv[n];
                    a.Count >= _eg && (e++,
                    t += a._ei)
                }
                if (e < 3)
                    return !1;
                for (var i = t / r, o = 0, n = 0; n < r; n++)
                    a = this._cv[n],
                    o += Math.abs(a._ei - i);
                return o <= .05 * t
            }
            ,
            this._ce = function(e) {
                this.image = e;
                var t = qrcode.height
                  , r = qrcode.width;
                (s = Math.floor(3 * t / (4 * _eh))) < _gf && (s = _gf);
                for (var n = !1, a = new Array(5), i = s - 1; i < t && !n; i += s) {
                    a[0] = 0,
                    a[1] = 0,
                    a[2] = 0,
                    a[3] = 0;
                    for (var o = a[4] = 0, _ = 0; _ < r; _++)
                        if (e[_ + i * qrcode.width])
                            1 == (1 & o) && o++,
                            a[o]++;
                        else if (0 == (1 & o))
                            if (4 == o)
                                if (this._ao(a)) {
                                    if (this._cu(a, i, _)) {
                                        var h, s = 2;
                                        this._ge ? n = this._cx() : (h = this._eq()) > a[2] && (i += h - a[2] - s,
                                        _ = r - 1)
                                    } else {
                                        for (; _++,
                                        _ < r && !e[_ + i * qrcode.width]; )
                                            ;
                                        _--
                                    }
                                    a[o = 0] = 0,
                                    a[1] = 0,
                                    a[2] = 0,
                                    a[3] = 0,
                                    a[4] = 0
                                } else
                                    a[0] = a[2],
                                    a[1] = a[3],
                                    a[2] = a[4],
                                    a[3] = 1,
                                    a[4] = 0,
                                    o = 3;
                            else
                                a[++o]++;
                        else
                            a[o]++;
                    this._ao(a) && this._cu(a, i, r) && (s = a[0],
                    this._ge && (n = this._cx()))
                }
                var c = this._ee();
                return qrcode._er(c),
                new _es(c)
            }
        }
        function _ai(e, t, r) {
            this.x = e,
            this.y = t,
            this.count = 1,
            this._aj = r,
            this.__defineGetter__("_ei", function() {
                return this._aj
            }),
            this.__defineGetter__("Count", function() {
                return this.count
            }),
            this.__defineGetter__("X", function() {
                return Math.floor(this.x)
            }),
            this.__defineGetter__("Y", function() {
                return Math.floor(this.y)
            }),
            this._ek = function() {
                this.count++
            }
            ,
            this._ev = function(e, t, r) {
                if (Math.abs(t - this.y) <= e && Math.abs(r - this.x) <= e) {
                    e = Math.abs(e - this._aj);
                    return e <= 1 || e / this._aj <= 1
                }
                return !1
            }
        }
        function _ak(c, e, d, w, t, r, n) {
            this.image = c,
            this._cv = new Array,
            this.startX = e,
            this.startY = d,
            this.width = w,
            this.height = t,
            this._ef = r,
            this._al = new Array(0,0,0),
            this._am = n,
            this._an = function(e, t) {
                return t - e[2] - e[1] / 2
            }
            ,
            this._ao = function(e) {
                for (var t = this._ef, r = t / 2, n = 0; n < 3; n++)
                    if (Math.abs(t - e[n]) >= r)
                        return !1;
                return !0
            }
            ,
            this._ap = function(e, t, r, n) {
                var a = this.image
                  , i = qrcode.height
                  , o = this._al;
                o[0] = 0,
                o[1] = 0,
                o[2] = 0;
                for (var _ = e; 0 <= _ && a[t + _ * qrcode.width] && o[1] <= r; )
                    o[1]++,
                    _--;
                if (_ < 0 || o[1] > r)
                    return NaN;
                for (; 0 <= _ && !a[t + _ * qrcode.width] && o[0] <= r; )
                    o[0]++,
                    _--;
                if (o[0] > r)
                    return NaN;
                for (_ = e + 1; _ < i && a[t + _ * qrcode.width] && o[1] <= r; )
                    o[1]++,
                    _++;
                if (_ == i || o[1] > r)
                    return NaN;
                for (; _ < i && !a[t + _ * qrcode.width] && o[2] <= r; )
                    o[2]++,
                    _++;
                if (o[2] > r)
                    return NaN;
                e = o[0] + o[1] + o[2];
                return !(5 * Math.abs(e - n) >= 2 * n) && this._ao(o) ? this._an(o, _) : NaN
            }
            ,
            this._cu = function(e, t, r) {
                var n = e[0] + e[1] + e[2]
                  , a = this._an(e, r)
                  , i = this._ap(t, Math.floor(a), 2 * e[1], n);
                if (!isNaN(i)) {
                    for (var o = (e[0] + e[1] + e[2]) / 3, _ = this._cv.length, h = 0; h < _; h++)
                        if (this._cv[h]._ev(o, i, a))
                            return new _ai(a,i,o);
                    e = new _ai(a,i,o);
                    this._cv.push(e),
                    null != this._am && this._am._ep(e)
                }
                return null
            }
            ,
            this.find = function() {
                for (var e = this.startX, t = this.height, r = e + w, n = d + (t >> 1), a = new Array(0,0,0), i = 0; i < t; i++) {
                    var o = n + (0 == (1 & i) ? i + 1 >> 1 : -(i + 1 >> 1));
                    a[0] = 0,
                    a[1] = 0,
                    a[2] = 0;
                    for (var _ = e; _ < r && !c[_ + qrcode.width * o]; )
                        _++;
                    for (var h, s = 0; _ < r; ) {
                        if (c[_ + o * qrcode.width])
                            if (1 == s)
                                a[s]++;
                            else if (2 == s) {
                                if (this._ao(a))
                                    if (null != (h = this._cu(a, o, _)))
                                        return h;
                                a[0] = a[2],
                                a[1] = 1,
                                a[2] = 0,
                                s = 1
                            } else
                                a[++s]++;
                        else
                            1 == s && s++,
                            a[s]++;
                        _++
                    }
                    if (this._ao(a))
                        if (null != (h = this._cu(a, o, r)))
                            return h
                }
                if (0 != this._cv.length)
                    return this._cv[0];
                throw "Couldn't find enough alignment patterns"
            }
        }
        function QRCodeDataBlockReader(e, t, r) {
            this._ed = 0,
            this._cw = 7,
            this.dataLength = 0,
            this.blocks = e,
            this._en = r,
            t <= 9 ? this.dataLengthMode = 0 : 10 <= t && t <= 26 ? this.dataLengthMode = 1 : 27 <= t && t <= 40 && (this.dataLengthMode = 2),
            this._gd = function(e) {
                var t = 0;
                if (e < this._cw + 1) {
                    for (var r = 0, n = 0; n < e; n++)
                        r += 1 << n;
                    return r <<= this._cw - e + 1,
                    t = (this.blocks[this._ed] & r) >> this._cw - e + 1,
                    this._cw -= e,
                    t
                }
                if (e < this._cw + 1 + 8) {
                    for (var a = 0, n = 0; n < this._cw + 1; n++)
                        a += 1 << n;
                    return t = (this.blocks[this._ed] & a) << e - (this._cw + 1),
                    this._ed++,
                    t += this.blocks[this._ed] >> 8 - (e - (this._cw + 1)),
                    this._cw = this._cw - e % 8,
                    this._cw < 0 && (this._cw = 8 + this._cw),
                    t
                }
                if (e < this._cw + 1 + 16) {
                    for (var a = 0, i = 0, n = 0; n < this._cw + 1; n++)
                        a += 1 << n;
                    var o = (this.blocks[this._ed] & a) << e - (this._cw + 1);
                    this._ed++;
                    var _ = this.blocks[this._ed] << e - (this._cw + 1 + 8);
                    this._ed++;
                    for (n = 0; n < e - (this._cw + 1 + 8); n++)
                        i += 1 << n;
                    i <<= 8 - (e - (this._cw + 1 + 8));
                    t = o + _ + ((this.blocks[this._ed] & i) >> 8 - (e - (this._cw + 1 + 8)));
                    return this._cw = this._cw - (e - 8) % 8,
                    this._cw < 0 && (this._cw = 8 + this._cw),
                    t
                }
                return 0
            }
            ,
            this.NextMode = function() {
                return this._ed > this.blocks.length - this._en - 2 ? 0 : this._gd(4)
            }
            ,
            this.getDataLength = function(e) {
                for (var t = 0; e >> t != 1; )
                    t++;
                return this._gd(qrcode._eo[this.dataLengthMode][t])
            }
            ,
            this.getRomanAndFigureString = function(e) {
                var t, r = e, n = 0, a = "", i = new Array("0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"," ","$","%","*","+","-",".","/",":");
                do {} while (1 < r ? (t = (n = this._gd(11)) % 45,
                a += i[Math.floor(n / 45)],
                a += i[t],
                r -= 2) : 1 == r && (a += i[n = this._gd(6)],
                --r),
                0 < r);
                return a
            }
            ,
            this.getFigureString = function(e) {
                for (var t = e, r = 0, n = ""; 3 <= t ? ((r = this._gd(10)) < 100 && (n += "0"),
                r < 10 && (n += "0"),
                t -= 3) : 2 == t ? ((r = this._gd(7)) < 10 && (n += "0"),
                t -= 2) : 1 == t && (r = this._gd(4),
                --t),
                n += r,
                0 < t; )
                    ;
                return n
            }
            ,
            this.get8bitByteArray = function(e) {
                for (var t, r = e, n = new Array; t = this._gd(8),
                n.push(t),
                r--,
                0 < r; )
                    ;
                return n
            }
            ,
            this.getKanjiString = function(e) {
                var t, r = e, n = "";
                do {
                    var a = ((t = this._gd(13)) / 192 << 8) + t % 192
                      , i = 0
                      , i = 33088 + a <= 40956 ? 33088 + a : 49472 + a
                } while (n += String.fromCharCode(i),
                0 < --r);
                return n
            }
            ,
            this.parseECIValue = function() {
                var e = 0
                  , t = this._gd(8);
                return 0 == (128 & t) && (e = 127 & t),
                128 == (192 & t) && (e = (63 & t) << 8 | this._gd(8)),
                192 == (224 & t) && (e = (31 & t) << 16 | this._gd(8)),
                e
            }
            ,
            this.__defineGetter__("DataByte", function() {
                for (var e = new Array; ; ) {
                    var t = this.NextMode();
                    if (0 == t) {
                        if (0 < e.length)
                            break;
                        throw "Empty data block"
                    }
                    if (1 != t && 2 != t && 4 != t && 8 != t && 7 != t)
                        throw "Invalid mode: " + t + " in (block:" + this._ed + " bit:" + this._cw + ")";
                    if (7 == t)
                        var r = this.parseECIValue();
                    else {
                        var n = this.getDataLength(t);
                        if (n < 1)
                            throw "Invalid data length: " + n;
                        switch (t) {
                        case 1:
                            for (var a = this.getFigureString(n), i = new Array(a.length), o = 0; o < a.length; o++)
                                i[o] = a.charCodeAt(o);
                            e.push(i);
                            break;
                        case 2:
                            for (a = this.getRomanAndFigureString(n),
                            i = new Array(a.length),
                            o = 0; o < a.length; o++)
                                i[o] = a.charCodeAt(o);
                            e.push(i);
                            break;
                        case 4:
                            r = this.get8bitByteArray(n);
                            e.push(r);
                            break;
                        case 8:
                            a = this.getKanjiString(n);
                            e.push(a)
                        }
                    }
                }
                return e
            })
        }
        qrcode._er = function(e) {
            function t(e, t) {
                var r = e.X - t.X
                  , t = e.Y - t.Y;
                return Math.sqrt(r * r + t * t)
            }
            var r, n, a, i, o, _, h = t(e[0], e[1]), s = t(e[1], e[2]), c = t(e[0], e[2]);
            h = h <= s && c <= s ? (r = e[0],
            n = e[1],
            e[2]) : s <= c && h <= c ? (r = e[1],
            n = e[0],
            e[2]) : (r = e[2],
            n = e[0],
            e[1]),
            a = n,
            o = h,
            _ = (i = r).x,
            i = i.y,
            (o.x - _) * (a.y - i) - (o.y - i) * (a.x - _) < 0 && (c = n,
            n = h,
            h = c),
            e[0] = n,
            e[1] = r,
            e[2] = h
        }
        ;
        var gCtx = null
          , gCanvas = null
          , c = 0
          , stype = 0
          , gUM = !1
          , webkit = !1
          , moz = !1
          , imghtml = '<div id="qrfile"><canvas id="out-canvas" width="314" height="250"></canvas><div id="imghelp"><small>Drag and Drop a QRCode here<br>or Select a file<input type="file" onchange="handleFiles(this.files)"/></small></div></div>';
        function dragenter(e) {
            e.stopPropagation(),
            e.preventDefault()
        }
        function dragover(e) {
            e.stopPropagation(),
            e.preventDefault()
        }
        function drop(e) {
            e.stopPropagation(),
            e.preventDefault();
            var t = e.dataTransfer
              , e = t.files;
            0 < e.length ? handleFiles(e) : t.getData("URL") && qrcode.decode(t.getData("URL"))
        }
        function handleFiles(e) {
            for (var t = 0; t < e.length; t++) {
                var r = new FileReader;
                r.onload = (e[t],
                function(e) {
                    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height),
                    qrcode.decode(e.target.result)
                }
                ),
                r.readAsDataURL(e[t])
            }
        }
        function initCanvas(e, t) {
            (gCanvas = document.getElementById("qr-canvas")).style.width = e + "px",
            gCanvas.style.height = t + "px",
            gCanvas.width = e,
            gCanvas.height = t,
            (gCtx = gCanvas.getContext("2d")).clearRect(0, 0, e, t)
        }
        function captureToCanvas() {
            if (1 == stype && gUM)
                try {
                    gCtx.drawImage(v, 0, 0);
                    try {
                        qrcode.decode()
                    } catch (e) {
                        console.log(e),
                        setTimeout(captureToCanvas, 500)
                    }
                } catch (e) {
                    console.log(e),
                    setTimeout(captureToCanvas, 500)
                }
        }
        function htmlEntities(e) {
            return String(e).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
        }
        function read(e) {
            var t = "<br>";
            0 !== e.indexOf("http://") && 0 !== e.indexOf("https://") || (t += "<a target='_blank' href='" + e + "'>" + e + "</a><br>"),
            t += "<b>" + htmlEntities(e) + "</b><br><br>",
            document.getElementById("qr-result").innerHTML = t
        }
        function isCanvasSupported() {
            var e = document.createElement("canvas");
            return !(!e.getContext || !e.getContext("2d"))
        }
        function success(e) {
            gUM = !0,
            setTimeout(captureToCanvas, 500)
        }
        const error = e=>gUM = !1;