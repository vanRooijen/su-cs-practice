---
title: "\\(q\\)-ary Hamming codes"
shell: tw314-native
sort_order: 67
---

<div class="tw314-native-document" data-tw314-slug="section-coding-qham">
<div id="content" class="pretext-content"><section class="section" id="section-coding-qham"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">10.5</span> <span class="title">\(q\)-ary Hamming codes</span>
</h2>
<p id="p-616">In order that \(C\) be a linear code with minimum distance 3, we require that any two columns of a parity-check matrix be linearly independent. Thus the columns of \(H\) must be non-zero and no column must be a scalar multiple of another.</p>
<p id="p-617">For fixed redundancy \(r\text{,}\) let us try to construct an \([n,n-r,3]\)-code over \(\mathbf{F}_q\text{,}\) with \(n\) as large as possible by finding as large a set as possible of non-zero vectors of \(V(r,q)\) such that none is a scalar multiple of another.</p>
<p id="p-618">For example in \(V(2,3)\text{,}\) with vectors written as columns, a partitioning into classes is</p>
<div class="displaymath">
\begin{equation*}
\left\{\left(0\atop1\right),\left(0\atop2\right)\right\}, \left\{\left(1\atop0\right),\left(2\atop0\right)\right\}, \left\{\left(1\atop1\right),\left(2\atop2\right)\right\}, \text{ and } \left\{\left(1\atop2\right),\left(2\atop1\right)\right\}
\end{equation*}
</div>
<p id="p-619">By choosing one vector from each class we obtain a set of \((q^r-1)/(q-1)\) vectors, no two of which are linearly dependent. Hence, by <span class="xref">Theorem 10.4.1</span>, taking these as the columns of \(H\) gives a parity-check matrix for a \([q^r-1)/(q-1),(q^r-1)/(q-1)-r,3]\)-code. This code is called a <dfn class="terminology">\(q\)-ary Hamming code</dfn> and is denoted by \(\operatorname{Ham}(r,q)\text{.}\)</p>
<p id="p-620">Note that different parity-check matrices may be chosen to define \(\operatorname{Ham}(r,q)\) for given \(r\) and \(q\text{,}\) but any such matrix may clearly be obtained from another by means of a permutation of the columns and/or the multiplication of some columns by non-zero scalars.</p>
<p id="p-621">Thus the Hamming codes are linear codes which are uniquely defined, up to equivalence, by their parameters.</p>
<p id="p-622">Note that, since any two vectors with leading 1's are linearly independent, we can choose all the vectors with leading 1's from \(V(r,q)\) asthe columns of our parity-check matrix.</p>
<article class="example example-like" id="example-coding-qham3"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">10.5.1</span><span class="period">.</span><span class="space"> </span><span class="title">\(q\)-ary Hamming codes.</span>
</h6>
<ol class="decimal">
<li id="li-197">Find a parity-check matrix for \(\operatorname{Ham}(2,3)\text{.}\)</li>
<li id="li-198">Find a parity-check matrix for \(\operatorname{Ham}(2,11)\text{.}\)</li>
<li id="li-199">Find a parity-check matrix for \(\operatorname{Ham}(3,3)\text{.}\)</li>
</ol>
<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-54"><div class="solution solution-like"><ol class="decimal">
<li id="li-200">A parity-check matrix for \(\operatorname{Ham}(2,3)\) is<div class="displaymath">
\begin{equation*}
H=\begin{bmatrix}
0 &amp; 1 &amp; 1 &amp; 1 \\
1 &amp; 0 &amp; 1 &amp; 2 
\end{bmatrix}.
\end{equation*}
</div>
</li>
<li id="li-201">A parity-check matrix for \(\operatorname{Ham}(2,11)\) is<div class="displaymath">
\begin{equation*}
H=\begin{bmatrix}
0 &amp; 1 &amp; 1 &amp; 1 &amp; 1 &amp; 1 &amp; 1 &amp; 1 &amp; 1 &amp; 1 &amp; 1 &amp; 1 \\
1 &amp; 0 &amp; 1 &amp; 2 &amp; 3 &amp; 4 &amp; 5 &amp; 6 &amp; 7 &amp; 8 &amp; 9 &amp; 10
\end{bmatrix}.
\end{equation*}
</div>
</li>
<li id="li-202">A parity-check matrix for \(\operatorname{Ham}(3,3)\) is<div class="displaymath">
\begin{equation*}
H=\begin{bmatrix}
0 &amp; 0 &amp; 0 &amp; 0 &amp; 1 &amp; 1 &amp; 1 &amp; 1 &amp; 1 &amp; 1 &amp; 1 &amp; 1 &amp; 1 \\
0 &amp; 1 &amp; 1 &amp; 1 &amp; 0 &amp; 0 &amp; 0 &amp; 1 &amp; 1 &amp; 1 &amp; 2 &amp; 2 &amp; 2 \\
1 &amp; 0 &amp; 1 &amp; 2 &amp; 0 &amp; 1 &amp; 2 &amp; 0 &amp; 1 &amp; 2 &amp; 0 &amp; 1 &amp; 2
\end{bmatrix}.
\end{equation*}
</div>
</li>
</ol></div></div>
</div></article><article class="theorem theorem-like" id="theorem-coding-qary"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">10.5.2</span><span class="period">.</span>
</h6>\(\operatorname{Ham}(r,q)\) is a perfect single-error-correcting code.</article><article class="hiddenproof" id="proof-41"><span class="id-ref original"><h6 class="heading"><span class="type">Proof<span class="period">.</span></span></h6></span></article><div class="hidden-content tex2jax_ignore" id="hk-proof-41"><article class="hiddenproof"><p id="p-623">\(\operatorname{Ham}(r,q)\) was constructed to be an \((n,M,3)\)-code with \(n=(q^r-1)/(q-1)\) and \(M=q^{n-r}\text{.}\) With \(t=1\text{,}\) the left-hand side of the Hamming bound becomes</p>
<div class="displaymath">
\begin{align*}
q^{n-r}(1+n(q-1)) &amp; = q^{n-r}(1+q^r-1)\\
&amp; =  q^n
\end{align*}
</div>
<p data-braille="continuation">which is the right-hand side of the Hamming bound, and so \(\operatorname{Ham}(r,q)\) is a perfect code.</p></article></div></section></div>
</div>
