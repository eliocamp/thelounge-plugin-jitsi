/*
Copyright (c) 2013, Deoxxa Development
======================================
All rights reserved.
--------------------

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
1. Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.
3. Neither the name of Deoxxa Development nor the names of its contributors
   may be used to endorse or promote products derived from this software
   without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY DEOXXA DEVELOPMENT ''AS IS'' AND ANY
EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL DEOXXA DEVELOPMENT BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/* from https://github.com/deoxxa/proquint */
var consonants = "bdfghjklmnprstvz".split(""),
    vowels     = "aiou".split("");

var encode = module.exports = function encode(buffer) {
  var bits = [];

  for (var i=0;i<buffer.length/2;++i) {
    var n = buffer.readUInt16BE(i * 2);

    var c1 = n         & 0x0f,
        v1 = (n >> 4)  & 0x03,
        c2 = (n >> 6)  & 0x0f,
        v2 = (n >> 10) & 0x03,
        c3 = (n >> 12) & 0x0f;

    bits.push([
      consonants[c1],
      vowels[v1],
      consonants[c2],
      vowels[v2],
      consonants[c3],
    ].join(""));
  }

  return bits.join("-");
};

var crypto = require("crypto");


const jitsiCommand = {
 input: function (client, target, command, args) {
    var bytes = crypto.randomBytes(8);
    var id = encode(bytes);
    var link = "meet.jit.si/useR2021/" + id;
    client.sendMessage("Here's your jitsi room: " + link, target.chan);

    if (args.length !== 0) {
        for (let nick in args) {
            client.runAsUser("/msg " + args[nick] + " Meet me on this jitsi room: " + link, target.chan.id);
        }
        client.sendMessage("Invitation sent to " + args.join(", ") + ".", target.chan);
    }
 }
};



module.exports = {
    onServerStart: api => {
      api.Commands.add("jitsi", jitsiCommand);
  }
};
