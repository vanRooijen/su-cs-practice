---
title: "Optimising the parameters \\(n\\text{,}\\) \\(M\\) and \\(d\\)"
shell: tw314-native
sort_order: 51
---

<div class="tw314-native-document" data-tw314-slug="section-coding-parameters">
<div id="content" class="pretext-content"><section class="section" id="section-coding-parameters"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">8.8</span> <span class="title">Optimising the parameters \(n\text{,}\) \(M\) and \(d\)</span>
</h2>
<p id="p-505">A good \((n,M,d)\)-code has small \(n\) (for fast transmission of messages), large \(M\) (to enable transmission of a wide variety of messages) and large \(d\) (to correct many errors). These are, however, conflicting aims. We opt to optimize one of the parameters \(n\text{,}\) \(M\text{,}\) \(d\) for given values of the other two.</p>
<p id="p-506">One problem is to find the largest code for a given length and minimum distance. We denote the largest value of \(M\) such that there exist a \(q\)-ary \((n,M,d)\)-code by \(A_q(n,d)\text{.}\) Solving this problem for \(d=1\) and \(d=n\) is relatively easy.</p>
<article class="theorem theorem-like" id="theorem-coding-largest-code"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">8.8.1</span><span class="period">.</span>
</h6>For a \(q\)-ary code with codewords of length \(n\)<ol class="decimal">
<li id="li-155">\(A_q(n,1)=q^n\text{,}\) and</li>
<li id="li-156">\(A_q(n,n)=q\text{.}\)</li>
</ol></article><article class="hiddenproof" id="proof-21"><span class="id-ref original"><h6 class="heading"><span class="type">Proof<span class="period">.</span></span></h6></span></article><div class="hidden-content tex2jax_ignore" id="hk-proof-21"><article class="hiddenproof"><ol class="decimal">
<li id="li-157">Since the number of codewords in a code is always less that the number of possible vectors in \(\mathbf{F}_q^n\text{,}\) \(A_q(n,1)\leq q^n\text{.}\) Since the whole of \(\mathbf{F}_q^n\) is a \(q\)-ary \((n,q^n,1)\)-code it follows that \(A_q(n,1)= q^n\text{.}\)</li>
<li id="li-158">Suppose that \(C\) is a \(q\)-ary \((n,M,n)\)-code. Then any two distinct codewords of \(C\) differ in all \(n\) positions. That is, the first position of every codeword must be distinct. Therefore \(C\) can have at most \(q\) codewords and \(A_q(n,n)\leq q\text{.}\) Since a repetition code is an \((n,q,n)\)-code \(A_q(n,n)=q\text{.}\)</li>
</ol></article></div>
<p id="p-507">For different values of \(d\) it is not always as easey.</p>
<article class="example example-like" id="example-coding-findA"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">8.8.2</span><span class="period">.</span><span class="space"> </span><span class="title">Optimising \(M\).</span>
</h6>Show that \(A_2(5,3)=4\text{.}\) That is, the  binary \((5,M,3)\)-code must have \(M\leq 4\text{.}\)<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-42"><div class="solution solution-like">
<p id="p-508">Let \(C\) be a \((5,M,3)\)-code. By <span class="xref">Lemma 8.7.3</span>  we may assume that \(C\) contains the zero vector \(\mathbf{0}\text{.}\) Since \(\mathbf{0}\in C\text{,}\) \(C\) contains no vectors of weight 1 or 2. Furthermore, if \(C\) contains more than one codeword of weight 4 or 5, say \(\mathbf{x}\) and \(\mathbf{y}\text{,}\) then \(\mathbf{x}\) and \(\mathbf{y}\) have at least three 1's in common. That is \(d(\mathbf{x},\mathbf{y})\leq 2\text{,}\) but this contradicts the fact that \(d(C)=3\) and therefore \(C\) has at most one codeword of weight 4 or 5.</p>
<p id="p-509">Now assume that \(C\) has at least three codewords, \(\mathbf{x}, \mathbf{y}\) and \(\mathbf{z}\text{,}\) of weight 3. We may assume that \(\mathbf{x}=(1,1,1,0,0)\text{.}\) Since \(d(C)=3\text{,}\) \(\mathbf{y}\) and \(\mathbf{z}\) can have at most one 1 inthe first three positions. But then \(d(\mathbf{x},\mathbf{x})\leq 2\text{,}\) a contradiction. Therefore \(C\) contains at most two codewords of weight 3. It follows that \(A_2(5,3)\leq 4\text{.}\) Since</p>
<div class="displaymath">
\begin{equation*}
C^*=\{(0,0,0,0,0),(1,1,1,0,0),(0,0,1,1,1),(1,1,0,1,1)\}
\end{equation*}
</div>
<p data-braille="continuation">is a \((5,4,3)\)-code, \(A_2(5,3)=4\text{.}\)</p>
</div></div>
</div></article><p id="p-510">To show that we only have to consider odd values of \(d\) to evaluate \(A_2(n,d)\text{,}\) we first need to prove the following lemmas.</p>
<p id="p-511">The <dfn class="terminology">weight</dfn> of a vector \(\mathbf{x}\in \mathbf{F}_q^n\text{,}\) is the number of non-zero entries of \(\mathbf{x}\text{.}\)</p>
<article class="lemma theorem-like" id="lemma-coding-dw1"><h6 class="heading">
<span class="type">Lemma</span><span class="space"> </span><span class="codenumber">8.8.3</span><span class="period">.</span>
</h6>If \(\mathbf{x},\mathbf{y}\in \mathbf{F}_2\text{,}\) then \(d(\mathbf{x},\mathbf{y})=w(\mathbf{x}+\mathbf{y})\text{.}\)</article><article class="hiddenproof" id="proof-22"><span class="id-ref original"><h6 class="heading"><span class="type">Proof<span class="period">.</span></span></h6></span></article><div class="hidden-content tex2jax_ignore" id="hk-proof-22"><article class="hiddenproof">The sum \(\mathbf{x}+\mathbf{y}\) has a 1 where \(\mathbf{x}\) and \(\mathbf{y}\) differ and a 0 where they agree.</article></div>
<article class="lemma theorem-like" id="lemma-coding-dw2"><h6 class="heading">
<span class="type">Lemma</span><span class="space"> </span><span class="codenumber">8.8.4</span><span class="period">.</span>
</h6>If \(\mathbf{x},\mathbf{y}\in \mathbf{F}_2\text{,}\) then \(d(\mathbf{x},\mathbf{y})=w(\mathbf{x})+w(\mathbf{y})-2w(\mathbf{x}\cap\mathbf{y})\text{,}\) where \(\mathbf{x}\cap\mathbf{y}=(x_1y_1,\dots,x_ny_n)\text{.}\)</article><article class="hiddenproof" id="proof-23"><span class="id-ref original"><h6 class="heading"><span class="type">Proof<span class="period">.</span></span></h6></span></article><div class="hidden-content tex2jax_ignore" id="hk-proof-23"><article class="hiddenproof"><div class="displaymath">
\begin{align*}
d(\mathbf{x},\mathbf{y})&amp; =w(\mathbf{x}+\mathbf{y})\\
&amp;=(\text{number of ones in }\mathbf{x})+(\text{number of ones in }\mathbf{y})\\
&amp;-2(\text{number of positions where }\mathbf{x} \text{ and } \mathbf{y} \text{ equals 1})\\
&amp; =w(\mathbf{x})+w(\mathbf{y})-2w(\mathbf{x}\cap\mathbf{y}).
\end{align*}
</div></article></div>
<article class="theorem theorem-like" id="theorem-coding-oddD"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">8.8.5</span><span class="period">.</span>
</h6>Suppose \(d\) is odd. Then a binary \((n,M,d)\)-code exists if and only if a binary \((n+1,M, d+1)\)-code exists.</article><article class="hiddenproof" id="proof-24"><span class="id-ref original"><h6 class="heading"><span class="type">Proof<span class="period">.</span></span></h6></span></article><div class="hidden-content tex2jax_ignore" id="hk-proof-24"><article class="hiddenproof"><p id="p-512">Let \(C\) be an \((n,M,d)\)-code and let \(\hat{C}\) be the code of length \(n+1\) by extending \(C\) as follows:</p>
<p id="p-513">For \(\mathbf{x}=(x_1,\dots,x_n)\in C\) define</p>
<div class="displaymath">
\begin{equation*}
\hat{\mathbf{x}}=\begin{cases} (x_1,\dots,x_n,0) \text{ if } w(x) \text{ is even, and}\\(x_1,\dots,x_n,1) \text{ if } w(x) \text{ is odd.}\end{cases}
\end{equation*}
</div>
<p id="p-514">In other words, add an overall parity check to each codeword of \(C\text{.}\)</p>
<p id="p-515">Then \(w(\hat{\mathbf{x}})\) is even for every \(\hat{\mathbf{x}}\in \hat{C}\) and from <span class="xref">Lemma 8.8.4</span> \(d(\mathbf{x},\mathbf{y})\) is even for every \(\mathbf{x},\mathbf{y}\in \hat{C}\text{.}\) It follows that \(d(C)\) is even.</p>
<p id="p-516">Since we have only added one element which may differ in two different codewords, \(d\leq d(\hat{C})\leq d+1\text{.}\) Since \(d\) is odd, it follows that \(d(\hat{C})=d+1\) and \(\hat{C}\) is an \((n+1,M,d+1)\)-code.</p>
<p id="p-517">Now consider the \((n+1,M,d+1)\)-code \(C\) with \(d\) odd. Choose codewords \(\mathbf{x},\mathbf{y}\in C\) such that \(d(\mathbf{x},\mathbf{y})=d+1\text{.}\) Now choose a position in which \(\mathbf{x}\) and \(\mathbf{y}\) differ and delete this position from every codeword. The result is an \((n,M,d)\)-code.</p></article></div>
<article class="corollary theorem-like" id="corollary-coding-oddD"><h6 class="heading">
<span class="type">Corollary</span><span class="space"> </span><span class="codenumber">8.8.6</span><span class="period">.</span>
</h6>If \(d\) is odd, then \(A_2(n+1,d+1)=A_2(n,d)\text{.}\) Equivalently, if \(d\) is even, then \(A_2(n,d)=A_2(n-1,d-1)\text{.}\)</article></section></div>
</div>
