---
title: "Trees"
shell: tw314-native
sort_order: 12
---

<div class="tw314-native-document" data-tw314-slug="section-trees">
<div id="content" class="pretext-content"><section class="section" id="section-trees"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">1.8</span> <span class="title">Trees</span>
</h2>
<p id="p-51">A <dfn class="terminology">forest</dfn> is an acyclic graph, while a <dfn class="terminology">tree</dfn> is an acyclic connected graph. Thus every component of a forest is a tree. The graph \(H\) of <span class="xref">Figure 1.4.4</span>  is a tree. It has five <dfn class="terminology">end-vertices</dfn>, that is vertices of degree one. In trees we usually call the end-vertices the <dfn class="terminology">leaves</dfn> of the tree.</p>
<p id="p-52">The tree on one vertex is called the <dfn class="terminology">trivial tree</dfn>; all others are the <dfn class="terminology">non-trivial</dfn> trees.</p>
<article class="theorem theorem-like" id="theorem-graph-tree"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">1.8.1</span><span class="period">.</span>
</h6>Every non-trivial tree has at least two leaves.</article><article class="hiddenproof" id="proof-4"><span class="id-ref original"><h6 class="heading"><span class="type">Proof<span class="period">.</span></span></h6></span></article><div class="hidden-content tex2jax_ignore" id="hk-proof-4"><article class="hiddenproof"><p id="p-53">Let \(T\) be a non-trivial tree. If \(T=K_2\text{,}\) then the result follows immediately. Now assume that \(T\) has order at least 3 and let \(P\) be a longest path of \(T\text{.}\) Suppose \(P=(u=v_1,v_2,\dots,v_{n-1},v_n=v)\) is a \(u-v\) path. Since \(P\) is a longest path, neither \(u\) nor \(v\) is adjacent to any vertex not on \(P\text{,}\) and since \(T\) has no cycles, neither \(u\) nor \(v\) are adjacent to any vertex of \(P\) (other than \(v_2\) and \(v_{n-1}\text{,}\) respectively) on \(P\text{.}\) Therefore both \(u\) and \(v\) are leaves of \(P\text{.}\)</p></article></div> The following theorem provides an characterization of trees. <article class="theorem theorem-like" id="theorem-graph-acyclic"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">1.8.2</span><span class="period">.</span>
</h6>A graph \(G\) of order \(p\) and size \(q\) is a tree if and only if \(G\) is acyclic and \(q = p - 1\text{.}\)</article><article class="hiddenproof" id="proof-5"><span class="id-ref original"><h6 class="heading"><span class="type">Proof<span class="period">.</span></span></h6></span></article><div class="hidden-content tex2jax_ignore" id="hk-proof-5"><article class="hiddenproof"><p id="p-54">Assume that \(G\) is a tree. Then \(G\) is acyclic by definition. We show that \(q = p - 1\) by induction on \(p\text{.}\) The result is true for trivial trees, since \(p = 1\) and \(q = 0\) in this case. Assume that the result is true for all trees of order \(p\) and size \(q\) and consider any tree \(T\) of order \(p + 1\text{.}\) Let \(v\) be a leaf of \(T\) and let \(T' = T - v\text{.}\) Then \(T'\) is a tree of order \(p\) and, by the induction hypothesis, size \(q = p - 1\text{.}\) Therefore \(T\) has size \(q + 1 = p = (p + 1) - 1\text{;}\) hence the result is true for any tree \(T\) of order \(p + 1\text{.}\)</p>
<p id="p-55">Conversely, let \(G\) be an acyclic graph of order \(p\) and size \(q = p - 1\text{.}\) To show that \(G\) is a tree, we need only verify that \(G\) is connected. Denote by \(G_1, G_2, \ldots, G_k\) the component of \(G\text{,}\) where \(G_i (1 \leq i \leq k)\) has order \(p_i\) and size \(q_i\text{.}\) Since each \(G_i\) is a tree, \(q_i = p_i - 1\text{.}\) Hence</p>
<div class="displaymath">
\begin{equation*}
p - 1 = q = \sum_{i = 1}^kq_i = \sum_{i=1}^k(p_i - 1) = p - k.
\end{equation*}
</div>
<p data-braille="continuation">Therefore \(k = 1\) and hence \(G\) is connected.</p></article></div></section></div>
</div>
