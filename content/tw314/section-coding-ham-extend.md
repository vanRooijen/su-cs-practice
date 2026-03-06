---
title: "The extended binary Hamming code"
shell: tw314-native
sort_order: 65
---

<div class="tw314-native-document" data-tw314-slug="section-coding-ham-extend">
<div id="content" class="pretext-content"><section class="section" id="section-coding-ham-extend"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">10.3</span> <span class="title">The extended binary Hamming code</span>
</h2>
<p id="p-604">The <dfn class="terminology">extended binary Hamming code</dfn> \(\operatorname{H\hat{a}m}(r,2)\) is the code obtained from \(\operatorname{Ham}(r,2)\) by adding an overall parity-check.</p>
<p id="p-605">Having minimum distance 4, \(\operatorname{H\hat{a}m}(r,2)\) is ideally suited for incomplete decoding, for it can simultaneously correct any single error and detect any double error.</p>
<p id="p-606">Let \(H\) be a parity-check matrix for \(\operatorname{Ham}(r,2)\text{.}\) A parity check matrix \(\hat H\) for the extended code may be obtained from \(H\) as follows:</p>
<div class="displaymath">
\begin{equation*}
\hat H=\begin{bmatrix}
&amp;&amp;&amp;&amp; 0 \\
&amp;&amp;&amp;&amp; 0 \\
&amp;&amp; H &amp;&amp; \vdots \\
&amp;&amp;&amp;&amp; 0 \\
1 &amp; 1 &amp; \cdots &amp; 1 &amp; 1
\end{bmatrix}.
\end{equation*}
</div>
<p id="p-607">The last row gives the overall parity-check equation on the codewords, that is</p>
<div class="displaymath">
\begin{equation*}
x_1+x_2+\cdots+x_{n+1}=0.
\end{equation*}
</div>
<p id="p-608">If \(H\) is taken in lexicographical order, then the syndrome of the error vector \(00\cdots010\cdots0\) (with 1 in the \(j^{\rm th}\) place) is just the transpose of the \(j^{\rm th}\) column of \(\hat H\text{.}\) An incomplete decoding algorithm is as follows:</p>
<p id="p-609">Suppose the received vector is \({\bf y}\text{.}\) Calculate the syndrome \(S({\bf y})={\bf y}\hat H^T=(s_1,s_2,\dots,s_r,s_{r+1})\text{.}\)</p>
<ol class="decimal">
<li id="li-193">If \(s_{r+1}=0\) and \((s_1,s_2,\dots,s_r)={\bf 0}\text{,}\) assume no errors.</li>
<li id="li-194">If \(s_{r+1}=0\) and \((s_1,s_2,\dots,s_r)\neq{\bf 0}\text{,}\) assume at least two errors have occurred and seek retransmission.</li>
<li id="li-195">If \(s_{r+1}=1\) and \((s_1,s_2,\dots,s_r)={\bf 0}\text{,}\) assume a single error in the last place.</li>
<li id="li-196">If \(s_{r+1}=1\) and \((s_1,s_2,\dots,s_r)\neq{\bf 0}\text{,}\) assume a single error in the \(j^{\rm th}\) place, where \(j\) is the number whose binary representation is \((s_1,s_2,\dots,s_r)\text{.}\)</li>
</ol>
<article class="example example-like" id="example-coding-decode-extham"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">10.3.1</span><span class="period">.</span><span class="space"> </span><span class="title">Decoding a extended Hamming code.</span>
</h6>Consider the extended binary Hamming code \(\operatorname{H\hat{a}m}(r,2)\) and decode the vector \({\bf y}=11010110\text{.}\)<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-53"><div class="solution solution-like">
<p id="p-610">The parity-check matrix of \(\operatorname{H\hat{a}m}(r,2)\) in lexicographical order is</p>
<div class="displaymath">
\begin{equation*}
\hat H=\begin{bmatrix}
0 &amp; 0 &amp; 0 &amp; 1 &amp; 1 &amp; 1 &amp; 1 &amp; 0 \\
0 &amp; 1 &amp; 1 &amp; 0 &amp; 0 &amp; 1 &amp; 1 &amp; 0 \\
1 &amp; 0 &amp; 1 &amp; 0 &amp; 1 &amp; 0 &amp; 1 &amp; 0 \\
1 &amp; 1 &amp; 1 &amp; 1 &amp; 1 &amp; 1 &amp; 1 &amp; 1
\end{bmatrix}.
\end{equation*}
</div>
<p id="p-611">If \({\bf y}=11010110\text{,}\) then \(S({\bf y})=1101\text{.}\) Since \(s_4=1\) and \((s_1,s_2,s_3)=(1,1,0)\) an error occured in the sixth position and so we decode \({\bf y}\) as \(11010110-00000100=11010010\text{.}\)</p>
</div></div>
</div></article></section></div>
</div>
