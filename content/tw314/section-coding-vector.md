---
title: "Vectorspaces"
shell: tw314-native
sort_order: 55
---

<div class="tw314-native-document" data-tw314-slug="section-coding-vector">
<div id="content" class="pretext-content"><section class="section" id="section-coding-vector"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">9.1</span> <span class="title">Vectorspaces</span>
</h2>
<p id="p-525">Throughout this section we assume that \(q\) is a prime power and we let \(\mathbf{F}_q\) denote the finite field of \(q\) elements. The elements of \(\mathbf{F}_q\) are the <dfn class="terminology">scalars</dfn>. The set \(\mathbf{F}_q^n\) of all ordered \(n\)-tuples over \(\mathbf{F}_q\) will now be denoted by \(V(n,q)\) and its elements are the <dfn class="terminology">vectors</dfn>.</p>
<p id="p-526">We define two operations within \(V(n,q)\)</p>
<ol class="decimal">
<li id="li-159">addition of vectors: if \({\bf x}=(x_1,x_2,\ldots,x_n)\) and \({\bf y}=(y_1,y_1,\ldots,y_n)\in V(n,q)\) then<div class="displaymath">
\begin{equation*}
{\bf x}+{\bf y}=(x_1+y_1,x_2+y_2,\ldots,x_n+y_n)
\end{equation*}
</div>
</li>
<li id="li-160">multiplication of a vector by a scalar: if \({\bf x}=(x_1,x_2,\ldots,x_n)\)  If \({\bf x}=(x_1,x_2,\ldots,x_n)\in V(n,q)\) and \(a\in \mathbf{F}_q\)  then<div class="displaymath">
\begin{equation*}
a{\bf x}=(ax_1,ax_2,\ldots,ax_n)
\end{equation*}
</div>
</li>
</ol>
<p id="p-527">Under vector addition and scalar multiplication \(V(n,q)\) satisfies the axioms of a <dfn class="terminology">vector space</dfn>, i.e. for all \({\bf x},{\bf y}\in V(n,q)\) and all \(a,b\in \mathbf{F}_q\)  we have</p>
<ol class="decimal">
<li id="li-161">\(V(n,q)\) forms an abelian group under vector addition,</li>
<li id="li-162">\(a{\bf x}\in V(n,q)\) (closure under scalar multiplication),</li>
<li id="li-163">\(a({\bf x}+{\bf y})=a{\bf x}+a{\bf y}\) (distributive over vector addition)\item \((a+b){\bf x}=a{\bf x}+b{\bf x}\) (distributive over scalar addition),</li>
<li id="li-164">\((ab){\bf x}=a(b{\bf x})\) (associative scalar multiplication), and</li>
<li id="li-165">\(1{\bf x}={\bf x}\)  where \(1\) is the multiplicative identity of \(\mathbf{F}_q\text{.}\)</li>
</ol>
<p id="p-528">A subset of \(V(n,q)\) is called a <dfn class="terminology">subspace</dfn> if it is itself a vector space under the same operations.</p>
<p id="p-529">Trivially, the set \(\{\bf 0\}\) and the whole space \(V(n,q)\) are subspaces of \(V(n,q)\text{.}\)  A subspace is called <dfn class="terminology">non-trivial</dfn> if it contains at least one vector other than \(\bf 0\text{.}\)</p>
<article class="theorem theorem-like" id="theorem-coding-subiffclosed"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">9.1.1</span><span class="period">.</span>
</h6>A non-empty subset \(C\) of \(V(n,q)\) is a subspace if and only if \(C\) is closed under addition and scalar multiplication, i.e. if and only if \(C\) satisfies the following two conditions: <ol class="decimal">
<li id="li-166">If \({\bf x},{\bf y}\in C\text{,}\) then \({\bf x}+{\bf y}\in C\text{.}\)</li>
<li id="li-167">If \(a\in \mathbf{F}_q\) and \({\bf x}\in C\text{,}\) then \(a{\bf x}\in C\text{.}\)</li>
</ol></article><article class="hiddenproof" id="proof-27"><span class="id-ref original"><h6 class="heading"><span class="type">Proof<span class="period">.</span></span></h6></span></article><div class="hidden-content tex2jax_ignore" id="hk-proof-27"><article class="hiddenproof"><p id="p-530">It is readily verified that if \(C\) satisfies the above, then \(C\) satisfies all the axioms for a vector space (with \(V(n,q)\) replaced by \(C\) . For example, for any \({\bf x}\in C\) we have by (2) that \(0{\bf x}={\bf 0}\in C\) and \(-1{\bf x}={\bf -x}\in C\text{.}\)</p></article></div>
<p id="p-531">Definitions and results from the theory of vector spaces over infinite fields, such as the real or complex numbers, generally carry over to the finite case, e.g. the following.</p>
<p id="p-532">A <dfn class="terminology">linear combination</dfn> of \(r\) vectors \({\bf x}_1,{\bf x}_2,\ldots,{\bf x}_r\) in \(V(n,q)\) is a vector of the form</p>
<div class="displaymath">
\begin{equation*}
a_1{\bf x}_1+a_2,{\bf x}_2+\cdots+a_r{\bf x}_r
\end{equation*}
</div>
<p data-braille="continuation">where the \(a_i\) are scalars.</p>
<article class="example example-like" id="example-coding-subspace"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">9.1.2</span><span class="period">.</span><span class="space"> </span><span class="title">Subspaces.</span>
</h6>Given a subset \(S\subseteq V(n,q)\)  the set of all linear combinations of vectors in \(S\) is a subspace of \((\mathbf{F}_q)^n\text{.}\)</article><p id="p-533">A set of vectors \(\{{\bf x}_1,{\bf x}_2,\ldots,{\bf x_r}\}\) is said to be <dfn class="terminology">linearly dependent</dfn> if there exist scalars \(a_1,a_2,\ldots,a_r\) which are not all zero, such that</p>
<div class="displaymath">
\begin{equation*}
a_1{\bf x}_1+a_2{\bf x}_2+\cdots+a_r{\bf x}_r=0,
\end{equation*}
</div>
<p data-braille="continuation">while a set of vectors that is not linearly dependent is called <dfn class="terminology">linearly independent</dfn>; i.e. if</p>
<div class="displaymath">
\begin{equation*}
a_1{\bf x}_1+a_2{\bf x}_2+\cdots+a_r{\bf x}_r=0\ \ \Rightarrow\ \ a_1=a_2=\cdots=a_r=0.
\end{equation*}
</div>
<p id="p-534">Let \(C\) be a subspace of \(V(n,q)\text{.}\) Then a subset \(\{{\bf x}_1,{\bf x}_2,\ldots,{\bf x_r}\}\) is called a <dfn class="terminology">generating set</dfn> (or <dfn class="terminology">spanning set</dfn>) of \(C\) if every vector in \(C\) can be expressed as a linear combination of \({\bf x}_1,{\bf x}_2,\ldots,{\bf x_r}\text{.}\)</p>
<p id="p-535">A generating set of \(C\) which is also linearly independent is called a <dfn class="terminology">basis</dfn> of \(C\text{.}\)</p>
<article class="example example-like" id="example-coding-basis"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">9.1.3</span><span class="period">.</span><span class="space"> </span><span class="title">Basis.</span>
</h6>The set<div class="displaymath">
\begin{equation*}
\{(1,0,0,\ldots,0),\ (0,1,0,\ldots,0),\ldots,(0,0,\ldots,0,1)\}
\end{equation*}
</div>is a basis for the whole space \(V(n,q)\text{.}\)</article><article class="theorem theorem-like" id="theorem-coding-basis"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">9.1.4</span><span class="period">.</span>
</h6>Suppose \(C\) is a non-trivial subspace of \(V(n,q)\text{.}\) Then any generating set of \(C\) contains a basis of \(C\text{.}\)</article><article class="hiddenproof" id="proof-28"><span class="id-ref original"><h6 class="heading"><span class="type">Proof<span class="period">.</span></span></h6></span></article><div class="hidden-content tex2jax_ignore" id="hk-proof-28"><article class="hiddenproof"><p id="p-536">Suppose \(\{{\bf x}_1,{\bf x}_2,\ldots,{\bf x_r}\}\) is a generating set of \(C\text{.}\) If it is linearly dependent, then there are scalars \(a_1,a_2,\ldots,a_r\)  not all zero, such that</p>
<div class="displaymath">
\begin{equation*}
a_1{\bf x}_1+a_2{\bf x}_2+\cdots+a_r{\bf x}_r=0.
\end{equation*}
</div>
<p id="p-537">If \(a_i\) is non-zero then</p>
<div class="displaymath">
\begin{equation*}
{\bf x}_i=-a_i^{-1}\sum_{j=1,j\neq i}^ra_j{\bf x}_j
\end{equation*}
</div>
<p data-braille="continuation">and so \({\bf x}_i\) is a linear combination of the other \({\bf x}_j\text{.}\) Thus \({\bf x}_i\) is redundant as a generator and can be omitted from the set \(\{{\bf x}_1,{\bf x}_2,\ldots,{\bf x_r}\}\) to leave a smaller generating set of \(C\text{.}\) In this way we can omit redundant generators, one at a time, until we reach a linearly independent generating set. The process must end since we begin with a finite set.</p></article></div>
<p id="p-538">Since any subspace \(C\) of \(V(n,q)\) contains a finite generating set (e.g. \(C\) itself), it follows from <span class="xref">Theorem 9.1.4</span> that every non-trivial subspace has a basis. A basis can be thought of as a <em class="alert">minimal</em> generating set, one which does not contain any redundant generators. Note that the basis is not unique.</p>
<article class="theorem theorem-like" id="theorem-coding-sizeofC"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">9.1.5</span><span class="period">.</span>
</h6>Suppose \(\{{\bf x}_1,{\bf x}_2,\ldots,{\bf x}_k\}\) is a basis of a subspace \(C\) of \(V(n,q)\text{.}\) Then <ol class="decimal">
<li id="li-168">every vector of \(C\) can be expressed <em class="alert">uniquely</em> as a linear combination of the basis vectors, and</li>
<li id="li-169">\(C\) contains exactly \(q^k\) vectors.</li>
</ol></article><article class="hiddenproof" id="proof-29"><span class="id-ref original"><h6 class="heading"><span class="type">Proof<span class="period">.</span></span></h6></span></article><div class="hidden-content tex2jax_ignore" id="hk-proof-29"><article class="hiddenproof"><ol class="decimal">
<li id="li-170">Suppose a vector \({\bf y}\) of \(C\) is represented in two ways as a linear combination of \(\{{\bf x}_1,{\bf x}_2,\ldots,{\bf x}_k\}\text{.}\)  That is,<div class="displaymath">
\begin{equation*}
{\bf y}=a_1{\bf x}_1+a_2{\bf x}_2+\cdots+a_k{\bf x}_k
\end{equation*}
</div>and<div class="displaymath">
\begin{equation*}
{\bf y}=b_1{\bf x}_1+b_2{\bf x}_2+\cdots+b_k{\bf x}_k\text{.}
\end{equation*}
</div>Then \((a_1-b_1){\bf x}_1+(a_2-b_2){\bf x}_2+\cdots+(a_k-b_k){\bf x}_k={\bf 0}\text{.}\) But the set \(\{{\bf x}_1,{\bf x}_2,\ldots,{\bf x}_k\}\) is linearly independent and so \(a_i-b_i=0\) for all \(i=1,2,\ldots,k\text{,}\) i.e. \(a_i=b_i\) for all such \(i\text{.}\)</li>
<li id="li-171">By (1), the \(q^k\) vectors \(\sum_{i=1}^ka_i{\bf x_i}\ \left(a_i\in \mathbf{F}_q\right)\) are precisely the distinct vectors of \(C\text{.}\)</li>
</ol></article></div>
<p id="p-539">It follows from <span class="xref">Theorem 9.1.5</span> that any two bases of a subspace \(C\) contain the same number \(k\) of vectors, where \(|C|=q^k\text{.}\) This number \(k\) is called the <dfn class="terminology">dimension</dfn> of the subspace \(C\) and is denoted by \(\dim{(C)}\text{.}\)</p></section></div>
</div>
