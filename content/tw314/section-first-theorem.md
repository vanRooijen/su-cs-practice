---
title: "The first theorem of graph theory"
shell: tw314-native
sort_order: 6
---

<div class="tw314-native-document" data-tw314-slug="section-first-theorem">
<div id="content" class="pretext-content"><section class="section" id="section-first-theorem"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">1.2</span> <span class="title">The first theorem of graph theory</span>
</h2>
<article class="theorem theorem-like" id="theorem-graph-first"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">1.2.1</span><span class="period">.</span><span class="space"> </span><span class="title">The first theorem of graph theory.</span>
</h6>Let \(G\) be a graph with vertex set \(V\) and edge set \(E\text{.}\) Then<div class="displaymath">
\begin{equation*}
\sum_{v \in V} deg(v) = 2|E|.
\end{equation*}
</div></article><article class="hiddenproof" id="proof-1"><span class="id-ref original"><h6 class="heading"><span class="type">Proof<span class="period">.</span></span></h6></span></article><div class="hidden-content tex2jax_ignore" id="hk-proof-1"><article class="hiddenproof"><p id="p-12">Every edge joins exactly two vertices. Therefore, in summing the degree of the vertices, we are counting every edge twice.</p></article></div>
<article class="corollary theorem-like" id="corollary-1"><h6 class="heading">
<span class="type">Corollary</span><span class="space"> </span><span class="codenumber">1.2.2</span><span class="period">.</span>
</h6>In any graph, there is an even number of odd vertices.</article><article class="hiddenproof" id="proof-2"><span class="id-ref original"><h6 class="heading"><span class="type">Proof<span class="period">.</span></span></h6></span></article><div class="hidden-content tex2jax_ignore" id="hk-proof-2"><article class="hiddenproof"><p id="p-13">Let \(G\) be a graph with vertex set \(V\) and edge set \(E\text{.}\) Then \(\sum_{v \in V}deg(v) = 2|E|\) by <span class="xref">Theorem 1.2.1</span>.</p>
<p id="p-14">Now let \(A\) and \(B\) be the sets of respectively the even and the odd vertices of \(V\text{.}\) Then</p>
<div class="displaymath">
\begin{equation*}
\sum_{v \in A}deg(v) + \sum_{v \in B}deg(v) = 2|E|.
\end{equation*}
</div>
<p data-braille="continuation">Since \(\sum_{v \in A}deg(v)\) and \(2|E|\) are even numbers, it follows that \(\sum_{v \in B}deg(v)\) must also be an even number; hence \(|B|\) must be even, i.e. there are an even number of odd vertices.</p></article></div></section></div>
</div>
