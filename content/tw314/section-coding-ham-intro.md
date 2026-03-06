---
title: "Introduction"
shell: tw314-native
sort_order: 63
---

<div class="tw314-native-document" data-tw314-slug="section-coding-ham-intro">
<div id="content" class="pretext-content"><section class="section" id="section-coding-ham-intro"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">10.1</span> <span class="title">Introduction</span>
</h2>
<p id="p-591">The Hamming Codes are an important family of single-error-correcting codes which are easy to encode and decode. They are linear codes and can be defined over any finite field \(\mathbf{F}_q\text{.}\)  A Hamming code is most conveniently defined by specifying its parity-check matrix. We first restrict our attention to the binary case.</p>
<p id="p-592">Let \(r\) be a positive integer and let \(H\) be a \(r\times(2^r-1)\) matrix whose columns are the distinct non-zero  vectors of \(V(r,2)\text{.}\) Then the code having \(H\) as its parity-check matrix is called a <dfn class="terminology">binary Hamming code</dfn> and is denoted by \(\operatorname{Ham}(r,2)\text{.}\)</p>
<p id="p-593">\(\operatorname{Ham}(r,2)\) has length \(n=2^r-1\) and dimension \(k=n-r\text{.}\) Thus \(r=n-k\) is the number of check symbols in each codeword and is also known as the <dfn class="terminology">redundancy</dfn> of the code.</p>
<p id="p-594">Since the columns of \(H\) may be taken in any order, the code \(\operatorname{Ham}(r,2)\) is, for given redundancy \(r\text{,}\) any one of a number of equivalent codes.</p>
<article class="example example-like" id="example-coding-ham2"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">10.1.1</span><span class="period">.</span><span class="space"> </span><span class="title">Hamming code with \(r=2\).</span>
</h6>Find the parity-check matrix and the generator matrix of the binary Hamming code \(\operatorname{Ham}(2,2)\text{.}\)<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-50"><div class="solution solution-like">
<p id="p-595">\(\operatorname{Ham}(2,2)\) has parity-check matrix</p>
<div class="displaymath">
\begin{equation*}
H=\begin{bmatrix}
1&amp;1&amp;0\\
1&amp;0&amp;1
\end{bmatrix}.
\end{equation*}
</div>
<p id="p-596">A generator matrix is \(G=[1\ 1\ 1]\text{;}\) so \(\operatorname{Ham}(2,2)\) is just the binary triple repetition code.</p>
</div></div>
</div></article><article class="example example-like" id="example-coding-ham3"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">10.1.2</span><span class="period">.</span><span class="space"> </span><span class="title">Hamming code with \(r=3\).</span>
</h6>Find the parity-check matrix and the generator matrix of the binary Hamming code \(\operatorname{Ham}(3,2)\text{.}\)<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-51"><div class="solution solution-like">
<p id="p-597">\(\operatorname{Ham}(3,2)\) has parity-check matrix</p>
<div class="displaymath">
\begin{equation*}
H=\begin{bmatrix}
0 &amp; 1 &amp; 1 &amp; 1 &amp; 1 &amp; 0 &amp; 0 \\
1 &amp; 0 &amp; 1 &amp; 1 &amp; 0 &amp; 1 &amp; 0 \\
1 &amp; 1 &amp; 0 &amp; 1 &amp; 0 &amp; 0 &amp; 1
\end{bmatrix}.
\end{equation*}
</div>
<p id="p-598">Hence a generator matrix for \(\operatorname{Ham}(3,2)\) is</p>
<div class="displaymath">
\begin{equation*}
G=\begin{bmatrix}
1 &amp; 0 &amp; 0 &amp; 0 &amp; 0 &amp; 1 &amp; 1 \\
0 &amp; 1 &amp; 0 &amp; 0 &amp; 1 &amp; 0 &amp; 1 \\
0 &amp; 0 &amp; 1 &amp; 0 &amp; 1 &amp; 1 &amp; 0 \\
0 &amp; 0 &amp; 0 &amp; 1 &amp; 1 &amp; 1 &amp; 1
\end{bmatrix}.
\end{equation*}
</div>
</div></div>
</div></article><article class="theorem theorem-like" id="theorem-coding-ham"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">10.1.3</span><span class="period">.</span>
</h6>The binary Hamming code {\rm Ham}\((r,2)\text{,}\) for \(r\geq 2\text{,}\) <ol class="decimal">
<li id="li-187">is a \([2^r-1,2^r-1-r]\)-code,</li>
<li id="li-188">has a minimum distance 3 (hence is single-error-correcting), and</li>
<li id="li-189">is a perfect code.</li>
</ol></article></section></div>
</div>
