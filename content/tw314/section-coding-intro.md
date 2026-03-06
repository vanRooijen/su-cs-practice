---
title: "Introduction"
shell: tw314-native
sort_order: 44
---

<div class="tw314-native-document" data-tw314-slug="section-coding-intro">
<div id="content" class="pretext-content"><section class="section" id="section-coding-intro"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">8.1</span> <span class="title">Introduction</span>
</h2>
<p id="p-465">Coding theory originated in C.E. Shannon's paper on the “Mathematical theory of communications” (1948, Bell Syst. Tech.J., 27, pp. 379--423, 623--656).</p>
<p id="p-466">Codes were invented to correct errors that occur when information coming from some source is transmitted over a noisy communication channel to a receiver. For instance, distortion of messages may occur if they are sent through telegraph lines, via magnetic tapes, compact discs or printed text.</p>
<p id="p-467">Consider the pictures of Mars, Saturn and other planets which were transmitted to earth by radio signals from satellites (the Mariners, Voyagers, etc.). A fine grid was placed over the pictures and the degree of blackness of each square of the grid was measured on a scale, say of 0 to 63. These numbers were then expressed as binary numbers, 6-tuples of 0's and 1's (which we call words) and sent to the Jet Propulsion Laboratory of Caltech in Pasadena (two different signals for 0 and 1). Very weak signals were received and had to be amplified. As a result of thermal noise it happened occasionally that signals transmitted as 0 were received as 1 (and vice versa). If the 6-tuples were transmitted as such, serious errors could occur, even if only one symbol was wrongly received.</p>
<p id="p-468">So <dfn class="terminology">redundancy</dfn> was built into the signal --- the transmitted sequence contained more than 6 symbols. In the case of Mariner, 6-letter words were first encoded as 32-letter words. Using methods which we shall study soon, the 64 possible 6-letter words were changed into 64 <dfn class="terminology">codewords</dfn> (of length 32) by an <dfn class="terminology">encoder</dfn>; the codewords were transmitted, which obviously took longer and used more resources than transmission of the original messages would have done. However, if up to 7 errors occurred during transmission to the receiver, the received 32-letter word could be decoded into the <dfn class="terminology">most likely</dfn> candidate from the 64 codewords (by a <dfn class="terminology">decoder</dfn>). Improved accuracy was obtained at the cost of using more than five times the amount of time needed without encoding.</p>
<p id="p-469">It is important to devise good codes that improve accuracy significantly at realistic cost.</p>
<p id="p-470">On the old computer tapes, for instance, where 5-letter binary words were punched in a continuous tape, codewords were 6-letter binary words consisting of the 5-letter message and, as a last symbol, either 0 or 1, whichever was needed to provide an even number of 1's in the codeword. So, if one error occurred in transmission, the received word contained an odd number of 1's and was at least recognised as erroneous, though the correct word could not be identified (this <dfn class="terminology">parity check</dfn> is an example of a <dfn class="terminology">single-error-detecting code</dfn>).</p></section></div>
</div>
