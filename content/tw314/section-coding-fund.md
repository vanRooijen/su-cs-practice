---
title: "A fundamental theorem"
shell: tw314-native
sort_order: 66
---

<div class="tw314-native-document" data-tw314-slug="section-coding-fund">
<div id="content" class="pretext-content"><section class="section" id="section-coding-fund"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">10.4</span> <span class="title">A fundamental theorem</span>
</h2>
<p id="p-612">Before defining Hamming codes over an arbitrary field \(\mathbf{F}_q\text{,}\) we establish a fundamental relationship between the minimum distance of a linear code and a linear independence property of the columns of a parity-check matrix. This result will also be important later.</p>
<article class="theorem theorem-like" id="theorem-coding-fundamental"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">10.4.1</span><span class="period">.</span>
</h6>Suppose \(C\) is a linear \([n,k]\)-code over \(\mathbf{F}_q\) with parity-check matrix \(H\text{.}\) Then the minimum distance of \(C\) is \(d\) if and only if any \(d-1\) columns of \(H\) are linearly independent but some \(d\) columns are linearly dependent.</article><article class="hiddenproof" id="proof-40"><span class="id-ref original"><h6 class="heading"><span class="type">Proof<span class="period">.</span></span></h6></span></article><div class="hidden-content tex2jax_ignore" id="hk-proof-40"><article class="hiddenproof"><p id="p-613">The minimum distance of \(C\) is equal to the smallest of the weights of the non-zero codewords. Let \({\bf x}=x_1x_2\cdots x_n\) be a vector in \(V(n,q)\text{.}\) Then</p>
<div class="displaymath">
\begin{align*}
{\bf x}\in C &amp; \iff {\bf x}H^T={\bf 0}\\
&amp; \iff  x_1{\bf H}_1+x_2{\bf H}_2+\cdots+x_n{\bf H}_n={\bf 0}
\end{align*}
</div>
<p data-braille="continuation">where the \({\bf H}_i\) denote the columns of \(H\text{.}\)</p>
<p id="p-614">Thus, corresponding to each codeword \({\bf x}\) of weight \(d\text{,}\) there is a set of \(d\) linearly dependent columns of \(H\text{.}\) On the other hand if there existed a set of \(d-1\) linearly dependent columns of \(H\text{,}\) say \({\bf H}_{i_1},{\bf H}_{i_2},\ldots,{\bf H}_{i_{d-1}}\text{,}\) then there would exist scalars \(x_{i_1},x_{i_2},\ldots,x_{i_{d-1}}\text{,}\) not all zero, such that</p>
<div class="displaymath">
\begin{equation*}
x_{i_1}{\bf H}_{i_1}+x_{i_2}{\bf H}_{i_2}+\cdots+x_{i_{d-1}}{\bf H}_{i_{d-1}}={\bf 0}.
\end{equation*}
</div>
<p id="p-615">But then the vector \({\bf x}=(0\cdots0x_{i_1}0\cdots0x_{i_2}0\cdots0x_{i_{d-1}}0\cdots0)\text{,}\) having \(x_{i_j}\) in the \(i_j^{\rm th}\) position for \(j=1,2,\ldots,d-1\text{,}\) and 0's elsewhere, would satisfy \({\bf x}H^T={\bf 0}\) and so would be a non-zero codeword of weight less than \(d\text{,}\) a contradiction.</p></article></div></section></div>
</div>
