---
title: "Maximal planar graphs"
shell: tw314-native
sort_order: 16
---

<div class="tw314-native-document" data-tw314-slug="section-maximal-planar">
<div id="content" class="pretext-content"><section class="section" id="section-maximal-planar"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">2.3</span> <span class="title">Maximal planar graphs</span>
</h2>
<p id="p-65">A planar graph \(G\) is called <dfn class="terminology">maximal planar</dfn> if, for any pair \(u, v\) of non-adjacent vertices of \(G\text{,}\) the graph \(G + uv\) is non-planar. In any embedding of a maximal planar graph \(G\) (on more than two vertices), the boundary of every region must be a triangle. For this reason maximal plane graphs are often called <dfn class="terminology">triangulations</dfn>.</p>
<article class="theorem theorem-like" id="theorem-graph-planar"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">2.3.1</span><span class="period">.</span>
</h6>If \(G\) is a maximal planar graph of order \(p \geqslant 3\) and size \(q\text{,}\) then \(q = 3p - 6\text{.}\)</article><article class="hiddenproof" id="proof-7"><span class="id-ref original"><h6 class="heading"><span class="type">Proof<span class="period">.</span></span></h6></span></article><div class="hidden-content tex2jax_ignore" id="hk-proof-7"><article class="hiddenproof"><p id="p-66">Embed \(G\) in the plane, resulting in a plane graph with \(r\) regions. The boundary of every region is a triangle, and each edge is on the boundary of two regions. Therefore, if the number of edges on the  boundary of a region is summed over all regions, the result is \(3r\text{.}\) On the other hand, such a sum counts each edge twice, so \(3r = 2q\text{.}\) It follows from Euler's Theorem that \(q = 3p - 6\text{.}\)</p></article></div>
<article class="corollary theorem-like" id="corollary-3"><h6 class="heading">
<span class="type">Corollary</span><span class="space"> </span><span class="codenumber">2.3.2</span><span class="period">.</span>
</h6>If \(G\) is a planar graph of order \(p \geq 3\) and size \(q\text{,}\) then \(q \leq 3p - 6\text{.}\)</article><article class="theorem theorem-like" id="theorem-graph-planar2"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">2.3.3</span><span class="period">.</span>
</h6>Let \(G\) be a maximal planar graph of order \(p \geq 4\text{,}\) and let \(p_i\) denote the number of vertices of degree \(i\) in \(G\text{,}\) for \(i = 3,4,5,\cdots\) Then<div class="displaymath">
\begin{equation*}
3p_3 + 2p_4 + p_5 = 12 + p_7 + 2p_8 + \cdots + (i-6)p_i + \cdots.
\end{equation*}
</div></article><article class="hiddenproof" id="proof-8"><span class="id-ref original"><h6 class="heading"><span class="type">Proof<span class="period">.</span></span></h6></span></article><div class="hidden-content tex2jax_ignore" id="hk-proof-8"><article class="hiddenproof"><p id="p-67">Since \(p \geq4\text{,}\) \(\delta(G) \geq 3\text{;}\) hence there are no vertices of degrees 0,1 or 2.</p>
<p id="p-68">Since \(P = \sum_{i=3}^\infty P_i\) and \(2q = \sum_{i=3}^\infty ip_i\text{,}\) it follows from \(q = 3p - 6\) that</p>
<div class="displaymath">
\begin{equation*}
\sum_{i=3}^\infty ip_i = 3\sum_{i=3}^\infty p_i - 12,
\end{equation*}
</div>
<p data-braille="continuation">hence</p>
<div class="displaymath">
\begin{equation*}
\sum_{i=3}^\infty (6-i)p_i = 12,
\end{equation*}
</div>
<p data-braille="continuation">hence</p>
<div class="displaymath">
\begin{equation*}
3p_3 + 2p_4 + p_5 = 12 + p_7 + 2p_8 + \cdots.
\end{equation*}
</div></article></div></section></div>
</div>
