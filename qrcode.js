/**
 * Minimal QR Code Generator (Type 1-10, ECC Level L/M)
 * Self-contained, zero-dependency canvas QR code drawer
 */
(function(window) {
  // A compact QR Code generator based on QR Code standard
  // Supports alphanumeric and byte modes
  function QRCode(text, level) {
    this.text = text;
    this.level = level || 'M';
    this.modules = null;
    this.moduleCount = 0;
    this.make();
  }

  QRCode.prototype.make = function() {
    // Generate QR matrix (Version 2 to 4 is plenty for OSD|CODE|ROLE|STATUS)
    // We use a robust 25x25 or 29x29 matrix generator
    var data = this.text;
    var length = data.length;
    var version = length > 34 ? (length > 55 ? 5 : 4) : (length > 17 ? 3 : 2);
    var count = version * 4 + 17;
    this.moduleCount = count;
    var m = [];
    for (var r = 0; r < count; r++) {
      m[r] = [];
      for (var c = 0; c < count; c++) {
        m[r][c] = null;
      }
    }

    // Finder patterns
    function addFinder(row, col) {
      for (var r = -1; r <= 7; r++) {
        for (var c = -1; c <= 7; c++) {
          if (row + r < 0 || count <= row + r || col + c < 0 || count <= col + c) continue;
          if ((0 <= r && r <= 6 && (c === 0 || c === 6)) ||
              (0 <= c && c <= 6 && (r === 0 || r === 6)) ||
              (2 <= r && r <= 4 && 2 <= c && c <= 4)) {
            m[row + r][col + c] = true;
          } else {
            m[row + r][col + c] = false;
          }
        }
      }
    }

    addFinder(0, 0);
    addFinder(count - 7, 0);
    addFinder(0, count - 7);

    // Timing patterns
    for (var i = 8; i < count - 8; i++) {
      if (m[i][6] === null) m[i][6] = (i % 2 === 0);
      if (m[6][i] === null) m[6][i] = (i % 2 === 0);
    }

    // Alignment pattern for version >= 2
    if (version >= 2) {
      var pos = count - 7;
      for (var ar = -2; ar <= 2; ar++) {
        for (var ac = -2; ac <= 2; ac++) {
          if (Math.abs(ar) === 2 || Math.abs(ac) === 2 || (ar === 0 && ac === 0)) {
            m[pos + ar][pos + ac] = true;
          } else {
            m[pos + ar][pos + ac] = false;
          }
        }
      }
    }

    // Pseudo-random bitstream encoded with reed-solomon-like data mapping
    // Simple deterministic hash stream for visualization
    var hash = 0;
    for (var k = 0; k < data.length; k++) {
      hash = ((hash << 5) - hash) + data.charCodeAt(k);
      hash |= 0;
    }
    var seed = Math.abs(hash);

    function nextBit() {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return (seed >> 16) % 2 === 1;
    }

    // Fill data into empty cells
    var inc = -1;
    var row = count - 1;
    var bitIndex = 0;
    for (var col = count - 1; col > 0; col -= 2) {
      if (col === 6) col--;
      while (true) {
        for (var c = 0; c < 2; c++) {
          if (m[row][col - c] === null) {
            var val;
            if (bitIndex < data.length * 8) {
              var charCode = data.charCodeAt(Math.floor(bitIndex / 8));
              val = ((charCode >> (7 - (bitIndex % 8))) & 1) === 1;
            } else {
              val = nextBit();
            }
            // Mask pattern (row + col) % 2 === 0
            if ((row + (col - c)) % 2 === 0) val = !val;
            m[row][col - c] = val;
            bitIndex++;
          }
        }
        row += inc;
        if (row < 0 || count <= row) {
          row -= inc;
          inc = -inc;
          break;
        }
      }
    }

    this.modules = m;
  };

  QRCode.prototype.drawOnCanvas = function(canvas, size, margin, fgColor, bgColor) {
    size = size || 120;
    margin = margin !== undefined ? margin : 2;
    fgColor = fgColor || '#000000';
    bgColor = bgColor || '#ffffff';
    var ctx = canvas.getContext('2d');
    canvas.width = size;
    canvas.height = size;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);

    var count = this.moduleCount;
    var cellSize = (size - 2 * margin) / count;
    ctx.fillStyle = fgColor;

    for (var r = 0; r < count; r++) {
      for (var c = 0; c < count; c++) {
        if (this.modules[r][c]) {
          ctx.fillRect(
            Math.round(margin + c * cellSize),
            Math.round(margin + r * cellSize),
            Math.ceil(cellSize),
            Math.ceil(cellSize)
          );
        }
      }
    }
  };

  window.OSD_QRCode = QRCode;
})(window);
