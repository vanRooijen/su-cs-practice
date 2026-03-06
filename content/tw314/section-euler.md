---
title: "Euler's theorem"
shell: tw314-native
sort_order: 15
---

<div class="tw314-native-document" data-tw314-slug="section-euler">
<div id="content" class="pretext-content"><section class="section" id="section-euler"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">2.2</span> <span class="title">Euler's theorem</span>
</h2>
<article class="theorem theorem-like" id="theorem-graph-euler"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">2.2.1</span><span class="period">.</span><span class="space"> </span><span class="title">Euler's Theorem.</span>
</h6>If \(G\) is a connected plane graph with \(p\) vertices, \(q\) edges and \(r\) regions, then<div class="displaymath">
\begin{equation*}
p + r = q + 2.
\end{equation*}
</div></article><article class="hiddenproof" id="proof-6"><span class="id-ref original"><h6 class="heading"><span class="type">Proof<span class="period">.</span></span></h6></span></article><div class="hidden-content tex2jax_ignore" id="hk-proof-6"><article class="hiddenproof"><p id="p-62">(by induction on \(q\))</p>
<p id="p-63">If \(q = 0\) then \(G \simeq K_1\text{;}\) hence \(p + r = 1 + 1 = 0 + 2 = q + 2\) and therefore the statement is true. Assume the statement is true for all connected plane graphs with \(q - 1\) edges (\(q \geq 1\)). Let \(G\) be a connected plane graph with \(q\) edges. If \(G\) is a tree, then \(p + r = p + 1 = (p - 1) + 2 = q + 2\) by <span class="xref">Theorem 1.8.2</span>.</p>
<p id="p-64">Assume now that \(G\) is not a tree. Let \(e\) be an edge on a cycle of \(G\) and consider the graph \(G - e\text{.}\) It is a connected plane graph with \(p\) vertices, \(q - 1\) edges and \(r - 1\) regions so that by the induction hypothesis \(p + (r - 1) = (q - 1) + 2\text{;}\) hence \(p + r = q + 2\text{.}\)</p></article></div>
<article class="corollary theorem-like" id="corollary-2"><h6 class="heading">
<span class="type">Corollary</span><span class="space"> </span><span class="codenumber">2.2.2</span><span class="period">.</span>
</h6>If \(G\) is a plane graph with \(p\) vertices, \(q\) edges, \(r\) regions and \(k\) components, then<div class="displaymath">
\begin{equation*}
p + r = q + 1 + k.
\end{equation*}
</div></article></section></div>
</div>
