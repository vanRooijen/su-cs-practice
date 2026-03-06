---
title: "Decoding with a binary Hamming code"
shell: tw314-native
sort_order: 64
---

<div class="tw314-native-document" data-tw314-slug="section-coding-ham-decode">
<div id="content" class="pretext-content"><section class="section" id="section-coding-ham-decode"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">10.2</span> <span class="title">Decoding with a binary Hamming code</span>
</h2>
<p id="p-599">Since \(\operatorname{Ham}(r,2)\) is a perfect single-error-correcting code, the coset leaders are precisely the \(2^r=n+1\) vectors of \(V(n,2)\) of weight \(\leq1\text{.}\)</p>
<p id="p-600">The syndrome of the vector \(0\cdots010\cdots0\) (with \(1\) in the \(j^{\rm th}\) place) is \((0\cdots010\cdots0)H^T\text{,}\) which is just the transpose of the \(j^{\rm th}\) column of \(H\text{.}\)</p>
<p id="p-601">If the columns of \(H\) are arranged in order of increasing binary numbers (i.e. the \(j^{\rm th}\) column of \(H\) is just the binary representation of \(j\)), we say \(H\) is in <dfn class="terminology">lexicographical order</dfn>. If \(H\) is in lexicographical order we decode the received vector \({\bf y}\) as follows.</p>
<ol class="decimal">
<li id="li-190">Calculate its syndrome \(S({\bf y})={\bf y}H^T\text{.}\)</li>
<li id="li-191">If \(S({\bf y})={\bf 0}\text{,}\) then assume \({\bf y}\) was the codeword sent.</li>
<li id="li-192">If \(S({\bf y})\neq{\bf 0}\text{,}\) then, assuming a single error, \(S({\bf y})\) gives the binary representation of the error position and so the error can be corrected.</li>
</ol>
<article class="example example-like" id="example-coding-decode-ham"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">10.2.1</span><span class="period">.</span><span class="space"> </span><span class="title">Decoding a Hamming code.</span>
</h6>Consider the binary Hamming code \(\operatorname{Ham}(3,2)\) and decode the vector \({\bf y}=1101011\text{.}\)<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-52"><div class="solution solution-like">
<p id="p-602">The parity-check matrix of \(\operatorname{Ham}(3,2)\) in lexicographical order is</p>
<div class="displaymath">
\begin{equation*}
H=\begin{bmatrix}
0 &amp; 0 &amp; 0 &amp; 1 &amp; 1 &amp; 1 &amp; 1 \\
0 &amp; 1 &amp; 1 &amp; 0 &amp; 0 &amp; 1 &amp; 1 \\
1 &amp; 0 &amp; 1 &amp; 0 &amp; 1 &amp; 0 &amp; 1
\end{bmatrix}.
\end{equation*}
</div>
<p id="p-603">If \({\bf y}=1101011\text{,}\) then \(S({\bf y})=110\text{,}\) indicating an error in the sixth position and so we decode \({\bf y}\) as \(1101011-0000010=1101001\text{.}\)</p>
</div></div>
</div></article></section></div>
</div>
