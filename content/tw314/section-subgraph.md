---
title: "Subgraphs"
shell: tw314-native
sort_order: 7
---

<div class="tw314-native-document" data-tw314-slug="section-subgraph">
<div id="content" class="pretext-content"><section class="section" id="section-subgraph"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">1.3</span> <span class="title">Subgraphs</span>
</h2>
<p id="p-15">A graph \(H\) is a <dfn class="terminology">subgraph</dfn> of a graph \(G\text{,}\) written \(H \subseteq G\text{,}\) if \(V(H) \subseteq V(G)\) and \(E(H) \subseteq E(G)\text{.}\) A subgraph \(H\) of the graph \(G\) is a <dfn class="terminology">spanning subgraph</dfn> of \(G\) if \(V(H) = V(G)\text{.}\)</p>
<p id="p-16">If \(U\) is a non-empty subset of the vertex set \(V(G)\) of a graph \(G\text{,}\) then the subgraph \(\left\langle U \right\rangle\) of \(G\) <dfn class="terminology">induced</dfn> by \(U\) is the graph having vertex set \(U\) and whose edge set consists of those edges of \(G\) incident with two elements of \(U\text{.}\) A subgraph \(H\) of \(G\) is called <dfn class="terminology">vertex-induced</dfn> if \(H = \left\langle U \right\rangle\) for some subset \(U\) of \(V(G)\text{.}\)</p>
<p id="p-17">Similarly, if \(X\) is a non-empty subset of \(E(G)\text{,}\) then the subgraph \(\left\langle X \right\rangle\) induced by \(X\) is the graph whose vertex set consists of those vertices of \(G\) incident with at least one edge of \(X\) and whose edge set is \(X\text{.}\) A subgraph \(H\) of \(G\) is <dfn class="terminology">edge-induce</dfn> if \(H = \left\langle X \right\rangle\) for some subset \(X\) of \(E(G)\text{.}\)</p>
<figure class="figure figure-like" id="figure-graph-induced"><div class="image-box" style="width: 50%; margin-left: 25%; margin-right: 25%;"><img src="/tw314-assets/images/figure_induced.JPG" style="width: 100%; height: auto;" alt=""></div>
<figcaption><span class="type">Figure</span><span class="space"> </span><span class="codenumber">1.3.1<span class="period">.</span></span><span class="space"> </span>Induced graphs</figcaption></figure><article class="example example-like" id="example-graph-subgraph"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">1.3.2</span><span class="period">.</span><span class="space"> </span><span class="title">Induced subgraphs.</span>
</h6> In <span class="xref">Figure 1.3.1</span>, the sets \(U = \{1,2,5 \}\) and \(X = \{14,25\}\) induce the subgraphs \(\left\langle U \right\rangle\) and \(\left\langle X \right\rangle\text{,}\) respectively.</article></section></div>
</div>
