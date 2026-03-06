---
title: "Decoding with a \\(q\\)-ary Hamming code"
shell: tw314-native
sort_order: 68
---

<div class="tw314-native-document" data-tw314-slug="section-coding-qham-decode">
<div id="content" class="pretext-content"><section class="section" id="section-coding-qham-decode"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">10.6</span> <span class="title">Decoding with a \(q\)-ary Hamming code</span>
</h2>
<p id="p-624">Since a Hamming code is a perfect single-error-correcting code, the coset leaders, other than \({\bf 0}\text{,}\) are precisely the vectors of weight 1. The syndrome of such a coset leader \(0\cdots0b0\cdots0\) with \(b\) in the \(j\)th position is</p>
<div class="displaymath">
\begin{equation*}
S(0\cdots0b0\cdots0)=(0\cdots0b0\cdots0)H^T=b{\bf H}_j^T
\end{equation*}
</div>
<p data-braille="continuation">where \({\bf H}_j\) denotes the \(j^{\rm th}\) column of \(H\text{.}\)</p>
<p id="p-625">The receive vector \({\bf y}\) is decodd as follows:</p>
<ol class="decimal">
<li id="li-203">Calculate \(S({\bf y})={\bf y}H^T\text{.}\)</li>
<li id="li-204">If \(S({\bf y})={\bf 0}\text{,}\) assume no errors.</li>
<li id="li-205">If \(S({\bf y)}\neq{\bf 0}\text{,}\) then \(S({\bf y)}=b{\bf H}_j^T\) for some \(b\) and \(j\) and the assumed single error is corrected by subtracting \(b\) from the \(j^{\rm th}\) entry of \({\bf y}\text{.}\)</li>
</ol>
<article class="example example-like" id="example-coding-decode-qham"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">10.6.1</span><span class="period">.</span><span class="space"> </span><span class="title">Decoding \(q\)-ary Hamming codes.</span>
</h6>Consider the 5-ary Hamming code \(\operatorname{Ham}(2,5)\) and decode the vector \({\bf y}=203031\text{.}\)<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-55"><div class="solution solution-like">A parity-check matrix for \(\operatorname{Ham}(2,5)\) is<div class="displaymath">
\begin{equation*}
H=\begin{bmatrix}
0 &amp; 1 &amp; 1 &amp; 1 &amp; 1 &amp; 1 \\
1 &amp; 0 &amp; 1 &amp; 2 &amp; 3 &amp; 4 
\end{bmatrix}.
\end{equation*}
</div>Then \(S({\bf y)}=(2,3)=2(1,4)\) and we assume an error of magnitude 2 in position 6. Hence, we decode \({\bf y}\) as \(203031-000002=203034\text{.}\)</div></div>
</div></article></section></div>
</div>
