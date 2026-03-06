---
title: "The Hamming bound"
shell: tw314-native
sort_order: 52
---

<div class="tw314-native-document" data-tw314-slug="section-coding-hammingbound">
<div id="content" class="pretext-content"><section class="section" id="section-coding-hammingbound"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">8.9</span> <span class="title">The Hamming bound</span>
</h2>
<p id="p-518">For any vector \({\bf u}\) in \((\mathbf{F}_q)^n\) and any integer \(r&gt;0\text{,}\) the <dfn class="terminology">sphere</dfn> of radius \(r\) and centre \({\bf u}\text{,}\) denoted \(S({\bf u},r)\text{,}\) is the set</p>
<div class="displaymath">
\begin{equation*}
\{{\bf v}\in(\mathbf{F}_q)^n\ |\ d({\bf u},{\bf v})\leq r\}.
\end{equation*}
</div>
<article class="lemma theorem-like" id="lemma-coding-sphere"><h6 class="heading">
<span class="type">Lemma</span><span class="space"> </span><span class="codenumber">8.9.1</span><span class="period">.</span>
</h6>A sphere of radius \(r\) in \((\mathbf{F}_q)^n\ (0 &lt; r\leq n)\) contains exactly<div class="displaymath">
\begin{equation*}
{ n \choose 0}+{ n \choose 1}(q-1)+{ n \choose 2}(q-1)^2+\cdots+{ n \choose r}(q-1)^r
\end{equation*}
</div>vectors.</article><article class="hiddenproof" id="proof-25"><span class="id-ref original"><h6 class="heading"><span class="type">Proof<span class="period">.</span></span></h6></span></article><div class="hidden-content tex2jax_ignore" id="hk-proof-25"><article class="hiddenproof">Let \({\bf u}\) be a fixed vector in \((\mathbf{F}_q)^n\text{.}\) Consider how many vectors \({\bf v}\) have distance exactly \(m\) from \({\bf u}\text{,}\) where \(m\leq n\text{.}\) The \(m\) positions in which \({\bf v}\) is to differ from \({\bf u}\) can be chosen in \({ n \choose m}\) ways and then in each of these \(m\) positions the entry of \({\bf v}\) can be chosen in \((q-1)\) ways to differ from the corresponding entry of \({\bf u}\text{.}\)</article></div>
<p id="p-519">The following bound is called <dfn class="terminology">The sphere-packing or Hamming bound</dfn>.</p>
<article class="theorem theorem-like" id="theorem-coding-hamming"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">8.9.2</span><span class="period">.</span>
</h6>A \(q\)-ary \((n,M,d)\)-code satisfies<div class="displaymath">
\begin{equation}
M\left\{{ n \choose 0}+{ n \choose 1}(q-1)+\cdots+{ n \choose t}(q-1)^t\right\}\leq q^n, \tag{8.9.1}
\end{equation}
</div> where \(t=\lfloor\frac{d-1}{2}\rfloor\).

</article><article class="hiddenproof" id="proof-26"><span class="id-ref original"><h6 class="heading"><span class="type">Proof<span class="period">.</span></span></h6></span></article><div class="hidden-content tex2jax_ignore" id="hk-proof-26"><article class="hiddenproof">Suppose \(C\) is a \(q\)-ary \((n,M,d)\)-code with \(t=\lfloor\frac{d-1}{2}\rfloor\). Any two spheres of radius \(t\) centred on distinct codewords can have no vectors in common, i.e. they have empty intersection. Hence the total number of vectors in the \(M\) spheres of radius \(t\) centred in the \(M\) codewords is given by the left-hand side of the equation. This number must be less than or equal to \(q^n\text{,}\) the total number of vectors in \((\mathbf{F}_q)^n\text{.}\)</article></div>
<article class="corollary theorem-like" id="corollary-coding-hammingbin"><h6 class="heading">
<span class="type">Corollary</span><span class="space"> </span><span class="codenumber">8.9.3</span><span class="period">.</span>
</h6>The special case of the Hamming bound for binary \((n,M,2t+1)\)-codes follows immediately:<div class="displaymath">
\begin{equation*}
M\left\{{ n \choose 0}+{ n \choose 1}+\cdots+{ n \choose t}\right\}\leq 2^n
\end{equation*}
</div></article></section></div>
</div>
