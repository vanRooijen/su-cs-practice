---
title: "Introduction to linear codes"
shell: tw314-native
sort_order: 56
---

<div class="tw314-native-document" data-tw314-slug="section-coding-linear">
<div id="content" class="pretext-content"><section class="section" id="section-coding-linear"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">9.2</span> <span class="title">Introduction to linear codes</span>
</h2>
<p id="p-540">\(C\) is a <dfn class="terminology">linear code</dfn> of length \(n\) over \(\mathbf{F}_q\) if \(C\) is a subspace of the vector space \(V(n,q)\text{.}\)</p>
<p id="p-541">It follows from <span class="xref">Theorem 9.1.1</span> that a subset \(C\) of \(V(n,q)\) is a linear code if and only if</p>
<ol class="decimal">
<li id="li-172">\({\bf u}+{\bf v}\in C\) for all \({\bf u},{\bf v}\in C\text{,}\) and</li>
<li id="li-173">\(a{\bf u}\in C\) for all \({\bf u}\in C,\ a\in \mathbf{F}_q\text{.}\)</li>
</ol>
<p id="p-542">\(C\) is a \(q\)-ary \([n,k]\)-code if \(C\) is a \(k\) dimensional subspace of \(V(n,q)\text{.}\) If \(C\) is a \(q\)-ary \([n,k,d]\)-code, it implies that \(C\) is a \(q\)-ary \((n,q^k,d)\)-code.</p>
<p id="p-543">For \({\bf x}\in V(n,q)\)  the <dfn class="terminology">weight</dfn> \(w({\bf x})\) is the number of non-zero entries of \({\bf x}\text{.}\)</p>
<article class="lemma theorem-like" id="lemma-coding-ddiffw"><h6 class="heading">
<span class="type">Lemma</span><span class="space"> </span><span class="codenumber">9.2.1</span><span class="period">.</span>
</h6>If \({\bf x},{\bf y}\in V(n,q)\)  then \(d({\bf x},{\bf y})=w({\bf x}-{\bf y})\text{.}\)</article><article class="hiddenproof" id="proof-30"><span class="id-ref original"><h6 class="heading"><span class="type">Proof<span class="period">.</span></span></h6></span></article><div class="hidden-content tex2jax_ignore" id="hk-proof-30"><article class="hiddenproof">Suppose \({\bf x}=x_1x_2\cdots x_n\) and \({\bf y}=y_1y_2\cdots y_n\) are in \(V(n,q)\text{.}\) Then \({\bf x}-{\bf y}=(x_1-y_1,x_2-y_2,\ldots,x_n-y_n)\text{.}\) Since \(x_i-y_i=0\) if and only if \(x_i=y_i\) for \(i=1,2,\ldots,n\text{,}\) it follows that \({\bf x}-{\bf y}\) has non-zero entries in precisely those positions where \({\bf x}\) and \({\bf y}\) differ. Therefore \(d({\bf x},{\bf y})=w({\bf x}-{\bf y})\text{.}\)</article></div>
<article class="theorem theorem-like" id="theorem-coding-disw"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">9.2.2</span><span class="period">.</span>
</h6>Let \(C\) be a linear code and \(w(C)=\min\{w({\bf x}) |{\bf x}\in C,{\bf x}\neq{\bf 0}\}\text{.}\) Then \(d(C)=w(C)\text{.}\)</article><article class="hiddenproof" id="proof-31"><span class="id-ref original"><h6 class="heading"><span class="type">Proof<span class="period">.</span></span></h6></span></article><div class="hidden-content tex2jax_ignore" id="hk-proof-31"><article class="hiddenproof"><p id="p-544">Let \({\bf x},{\bf y}\in C\) such that \(d({\bf x},{\bf y})=d(C)\text{.}\) Furthermore, since \({\bf x}-{\bf y}\in C\) it follows that \(w({\bf x}-{\bf y})\geq w(C)\text{.}\) By <span class="xref">Lemma 9.2.1</span>, \(d(C)=d({\bf x},{\bf y})=w({\bf x}-{\bf y})\geq w(C)\text{.}\)</p>
<p id="p-545">Let \({\bf x}\in C\) such that \(w({\bf x})=w(C)\text{.}\) Since \({\bf 0}\in C\text{,}\) \(d({\bf x},{\bf 0})\geq d(C)\text{.}\) It now follows by <span class="xref">Lemma 9.2.1</span> that \(w(C)=w({\bf x}-{\bf 0})=d({\bf x},{\bf 0})\geq d(C)\text{.}\)</p>
<p id="p-546">Therefore \(d(C)=w(C)\) .</p></article></div>
<article class="example example-like" id="example-coding-linear"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">9.2.3</span><span class="period">.</span><span class="space"> </span><span class="title">Linear codes.</span>
</h6>Show that<div class="displaymath">
\begin{equation*}
C=\{x_1x_2\cdots c_{10}\in V(10,11)|\sum_{i=1}^{10}ix_i=0\}
\end{equation*}
</div>is a linear code.<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-43"><div class="solution solution-like">
<p id="p-547">We must show that the subset \(C\) of \(V(10,11)\) is a subspace of \(V(10,11)\text{.}\)  Since \({\bf 0}\in C\text{,}\)  \(C\) is non-empty. Consider any \({\bf x}=x_1x_2\cdots x_{10},\ {\bf y}=y_1y_2\cdots y_{10}\) of \(C\) and any \(a,b\in F_{11}\text{.}\)</p>
<p id="p-548">Then \(a{\bf x}+b{\bf y}=(ax_1+by_1,ax_2+by_2,\ldots,ax_{10}+bx_{10})\) is in \(V(10,11)\) and</p>
<div class="displaymath">
\begin{equation*}
\sum_{i=1}^{10}i(ax_i+by_i)=a\sum_{i=1}^{10}ix_i+b\sum_{i=1}^{10}iy_i=a\cdot{ 0}+b\cdot{ 0}={ 0}.
\end{equation*}
</div>
<p data-braille="continuation">Therefore \(a{\bf x}+b{\bf y}\in C\text{.}\)  It follows that \(C\) is a subspace of \(V(10,11)\text{.}\)</p>
</div></div>
</div></article><p id="p-549">A \(k\times n\) matrix whose rows form a basis of a linear \([n,k]\) code is called a <dfn class="terminology">generator matrix</dfn> of the code.</p>
<article class="example example-like" id="example-coding-generator"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">9.2.4</span><span class="period">.</span><span class="space"> </span><span class="title">Generator matrix.</span>
</h6>Find a generator matrix for the binary code \(C=\{000,011,101,110\}\text{.}\)<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-44"><div class="solution solution-like">
<p id="p-550">Since \(011+101=110\text{,}\) \(110\)is not part of the basis. Futhermore, since \(011\) and \(101\) are linearly independent \(\{011,101\}\) forms a basis for \(C\) and</p>
<div class="displaymath">
\begin{equation*}
\begin{bmatrix}
0&amp;1&amp;1\\
1&amp;0&amp;1
\end{bmatrix}
\end{equation*}
</div>
<p data-braille="continuation">is a generator matrix of \(C\text{.}\)</p>
<p id="p-551">It generates \(C\) by taking all linear combinations (in \(\mathbf{F}_2\)  of \(011\) and \(101\)</p>
<div class="displaymath">
\begin{align*}
0(011)+0(101) &amp; = 000\\
0(011)+1(101) &amp; = 101\\
1(011)+0(101) &amp; =  011\\
1(011)+1(101) &amp; =  110
\end{align*}
</div>
<p id="p-552">The code \(C\) is a binary \([3,2,2]\)-code and a binary \((3,4,2)\)-code.</p>
</div></div>
</div></article><article class="example example-like" id="example-coding-rep"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">9.2.5</span><span class="period">.</span><span class="space"> </span><span class="title">Repitition codes.</span>
</h6>Every \(q\)-ary repetition code is linear.</article></section></div>
</div>
