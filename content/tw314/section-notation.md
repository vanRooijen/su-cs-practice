---
title: "Basic notation"
shell: tw314-native
sort_order: 5
---

<div class="tw314-native-document" data-tw314-slug="section-notation">
<div id="content" class="pretext-content"><section class="section" id="section-notation"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">1.1</span> <span class="title">Basic notation</span>
</h2>
<p id="p-6">A <dfn class="terminology">graph</dfn> \(G\) is a finite non-empty set \(V\) of objects called <dfn class="terminology">vertices</dfn> together with a (possibly empty) set \(E\) of unordered pairs of distinct vertices called <dfn class="terminology">edges</dfn>.</p>
<p id="p-7">The edge \(e = \{u,v\}\) is said to <dfn class="terminology">join</dfn> the vertices \(u\) and \(v\text{,}\) in which case \(u\) and \(v\) are <dfn class="terminology">adjacent</dfn> vertices. We usually denote the edge \(\{u,v\}\) simple by \(uv\) or \(vu\text{.}\)  The cardinality \(|V|\) of the vertex set is called the <dfn class="terminology">order</dfn> of the graph, while the cardinality \(|E|\) of the edge set is called the <dfn class="terminology">size</dfn> of the graph.</p>
<figure class="figure figure-like" id="figure-graph-order"><div class="image-box" style="width: 50%; margin-left: 25%; margin-right: 25%;"><img src="/tw314-assets/images/figure_first.JPG" style="width: 100%; height: auto;" alt=""></div>
<figcaption><span class="type">Figure</span><span class="space"> </span><span class="codenumber">1.1.1<span class="period">.</span></span><span class="space"> </span>A graph of order 5 and size 6</figcaption></figure><article class="example example-like" id="example-graph-order"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">1.1.2</span><span class="period">.</span><span class="space"> </span><span class="title">Vertices and edges.</span>
</h6>
<p id="p-8">Let \(G\) be the graph with the vertex set \(V = \{a,b,c,d,e\}\) and edge set \(E = \{ \{a,b \}, \{b, c \}, \{b, e \},\{b, d \}, \{d, e \}, \{e, c \} \}.\) See a graphic representation of \(G\) in <span class="xref">Figure 1.1.1</span>.</p>
<p id="p-9">The graph \(G\) has order 5 and size 6, since it has 5 vertices and 6 edges, The vertex \(e\) is adjacent to the three vertices \(c\text{,}\) \(b\) and \(d\text{,}\) but it is not adjacent to \(a\text{.}\)</p></article><p id="p-10">The <dfn class="terminology">degree</dfn> of a vertex \(v\) in a graph \(G\) is the number of vertices adjacent to \(v\text{,}\) i.e. the number of vertices joined to \(v\) by an edge. The degree of \(v\) in the graph \(G\) is denoted by \(\deg_G(v)\text{,}\) or simply by \(\deg(v)\) if \(G\) is clear from the context.</p>
<p id="p-11">A vertex is called <dfn class="terminology">even</dfn> or <dfn class="terminology">odd</dfn> according to whether its degree is even of odd. The <dfn class="terminology">minimum degree</dfn> \(\delta(G)\) of \(G\) is the minimum degree among all vertices of G. The <dfn class="terminology">maximum degree</dfn> \(\Delta(G)\) is defined similarly.</p>
<article class="example example-like" id="example-graph-deg"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">1.1.3</span><span class="period">.</span><span class="space"> </span><span class="title">Vertex degree.</span>
</h6> In the graph \(G\) of <span class="xref">Figure 1.1.1</span>, \(\deg(a) = 1\) and \(\deg(b) = 4\text{.}\) The vertices \(b\text{,}\) \(c\) and \(d\) are even vertices, and the odd vertices are \(a\) and \(e\text{.}\) Finally, \(\delta(G) = 1\) and \(\Delta(G) = 4\text{.}\)</article></section></div>
</div>
