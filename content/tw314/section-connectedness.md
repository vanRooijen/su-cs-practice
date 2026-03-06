---
title: "Paths and connectivity"
shell: tw314-native
sort_order: 8
---

<div class="tw314-native-document" data-tw314-slug="section-connectedness">
<div id="content" class="pretext-content"><section class="section" id="section-connectedness"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">1.4</span> <span class="title">Paths and connectivity</span>
</h2>
<p id="p-18">A <dfn class="terminology">\(u-v\) path</dfn> in a graph \(G\) is a sequence \(v_0 v_1 \ldots v_n\) of  (distinct) vertices with \(u = v_0\) and \(v = v_n\) and such \(G\) contains the edges \(v_0v_1, v_1v_2, \ldots, v_{n-1}v_n\text{.}\) The number \(n\) of edges is the <dfn class="terminology">length</dfn> of the \(u-v\) path.</p>
<p id="p-19">A <dfn class="terminology">cycle</dfn> in a graph \(G\) is a sequence \(v_0 v_1 \ldots v_{n-1},v_0\) of distinct vertices such that \(v_0v_1,v_1v_2, v_2v_3, \ldots, v_{n-1}v_0\) are edges of \(G\text{.}\)</p>
<article class="example example-like" id="example-graph-path"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">1.4.1</span><span class="period">.</span><span class="space"> </span><span class="title">Paths and cycles.</span>
</h6>In the graph \(G\) in <span class="xref">Figure 1.4.2</span> find a path of length four and a cycle of length five.<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-1"><div class="solution solution-like">
<p id="p-20">A path of length four of graph \(G\) is given by 1, 2, 4, 5, 3.</p>
<p id="p-21">A cycle of length five is 1, 2, 4, 5, 3, 1.</p>
</div></div>
</div></article><figure class="figure figure-like" id="figure-graph-path"><div class="image-box" style="width: 30%; margin-left: 35%; margin-right: 35%;"><img src="/tw314-assets/images/figure_paths_cycles1.JPG" style="width: 100%; height: auto;" alt=""></div>
<figcaption><span class="type">Figure</span><span class="space"> </span><span class="codenumber">1.4.2<span class="period">.</span></span><span class="space"> </span>The graph \(G\text{.}\)</figcaption></figure><p id="p-22">A graph itself is called a <dfn class="terminology">path</dfn> if all its vertices and edges are those of a path in a graph. We similarly define a graph to be a <dfn class="terminology">cycle</dfn>. \(P_n\) denotes the path of order \(n\) and \(C_n\) denotes the cycle of order \(n\text{.}\)</p>
<figure class="figure figure-like" id="figure-graph-path2"><div class="image-box" style="width: 50%; margin-left: 25%; margin-right: 25%;"><img src="/tw314-assets/images/figure_paths_cycles2.JPG" style="width: 100%; height: auto;" alt=""></div>
<figcaption><span class="type">Figure</span><span class="space"> </span><span class="codenumber">1.4.3<span class="period">.</span></span><span class="space"> </span>Paths of order 3, 4 and 5 and cycles of order 4 and 5.</figcaption></figure><p id="p-23">Two vertices \(u\) and \(v\) of graph \(G\) is <dfn class="terminology">connected</dfn> if there exists a \(u-v\) path in \(G\text{.}\) A graph \(G\) is <dfn class="terminology">connected</dfn> if every two of its vertices are connected, otherwise \(G\) is <dfn class="terminology">disconnected</dfn>.</p>
<p id="p-24">The relation “is connected to” is an equivalence relation (see <a href="/tw314/section-crypto-mod" class="internal" title="Section 5.1: Modular arithmetic">Section 5.1</a> for definition) on the vertex set of every graph \(G\text{.}\) Each subgraph induced by the vertices in a resulting equivalence class is called a <dfn class="terminology">component</dfn> of \(G\text{.}\) Hence, a component of \(G\) is a subgraph that is maximal with respect to the property of being connected.</p>
<figure class="figure figure-like" id="figure-graph-connected"><div class="image-box" style="width: 50%; margin-left: 25%; margin-right: 25%;"><img src="/tw314-assets/images/figure_planegraphs.JPG" style="width: 100%; height: auto;" alt=""></div>
<figcaption><span class="type">Figure</span><span class="space"> </span><span class="codenumber">1.4.4<span class="period">.</span></span><span class="space"> </span>The graphs \(G\) and \(H\) are connected graphs, but \(K\) is a disconnected graph.</figcaption></figure><p id="p-25">The graphs \(G\) and \(H\) of example <span class="xref">Figure 1.4.4</span> are connected graphs. \(K\) is a disconnected graph with two components, one is the path \(P_2\) and the other a 4-cycle.</p></section></div>
</div>
