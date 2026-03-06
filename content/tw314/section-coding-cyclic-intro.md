---
title: "Introduction"
shell: tw314-native
sort_order: 70
---

<div class="tw314-native-document" data-tw314-slug="section-coding-cyclic-intro">
<div id="content" class="pretext-content"><section class="section" id="section-coding-cyclic-intro"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">11.1</span> <span class="title">Introduction</span>
</h2>
<p id="p-627">Cyclic codes form an important class of linear codes. A code is <dfn class="terminology">cyclic</dfn> if \(C\) is a linear code and any cyclic shift of a codeword is also a codeword of \(C\text{,}\) that is,  whenever \(a_0a_1\dots a_{n-1}\) is in \(C\text{,}\) then so is \(a_{n-1}a_0a_1\dots a_{n-2}\text{.}\)</p>
<article class="example example-like" id="example-coding-cyclic"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">11.1.1</span><span class="period">.</span><span class="space"> </span><span class="title">Cyclic codes.</span>
</h6>Determine wheter the following codes are cyclic.<ol class="decimal">
<li id="li-206">The binary code \(C_1=\{000,101,011,110\}\)</li>
<li id="li-207">The binary code \(C_2=\{0000,1001,0110,1111\}\)</li>
</ol>
<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-56"><div class="solution solution-like"><ol class="decimal">
<li id="li-208">\(C_1\) is a linear code and any cyclic shift of a codeword in \(C_1\) is again a codeword. Therefore, \(C_1\) is a cylic code.</li>
<li id="li-209">The binary code \(C=\{0000,1001,0110,1111\}\) is not cyclic, since \(0011\not\in C\text{.}\) The code \(C\) is however equivalent to a cyclic code; interchanging the third and fourth coordinates of every codeword gives the cyclic code \(\{0000,1010,0101,1111\}\text{.}\)</li>
</ol></div></div>
</div></article></section></div>
</div>
