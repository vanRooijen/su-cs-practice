---
title: "A characterization of planar graphs"
shell: tw314-native
sort_order: 18
---

<div class="tw314-native-document" data-tw314-slug="section-maximal">
<div id="content" class="pretext-content"><section class="section" id="section-maximal"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">2.5</span> <span class="title">A characterization of planar graphs</span>
</h2>
<article class="theorem theorem-like" id="theorem-graph-non_planar"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">2.5.1</span><span class="period">.</span>
</h6>The graph \(K_5\) is non-planar.</article><article class="hiddenproof" id="proof-10"><span class="id-ref original"><h6 class="heading"><span class="type">Proof<span class="period">.</span></span></h6></span></article><div class="hidden-content tex2jax_ignore" id="hk-proof-10"><article class="hiddenproof"><p id="p-92">To the contrary, assume that \(K_5\) is a planar graph. Since \(p=5\) and \(q=10\text{,}\) it follows that</p>
<div class="displaymath">
\begin{equation*}
10=q\not\leq 3p-6=3(5)-6=9.
\end{equation*}
</div>
<p data-braille="continuation">This is a contradiction and it therefore follows that \(K_5\) is non-planar.</p></article></div>
<article class="theorem theorem-like" id="theorem-graph-non_planar2"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">2.5.2</span><span class="period">.</span>
</h6>The graph \(K_{3,3}\) is non-planar.</article><article class="hiddenproof" id="proof-11"><span class="id-ref original"><h6 class="heading"><span class="type">Proof<span class="period">.</span></span></h6></span></article><div class="hidden-content tex2jax_ignore" id="hk-proof-11"><article class="hiddenproof"><p id="p-93">To the contrary, assume that \(K_{3,3}\) is a planar graph. Since \(K_{3,3}\)does not contain any triangles an embedding of \(K_{3,3}\) in the plane will only contain cycles of size 4 and larger.</p>
<p id="p-94">Embed \(K_{3,3}\) in the plane, resulting in a plane graph with \(r\) regions. The boundary of every region is of size at least 4, and each edge is on the boundary of two regions. Therefore, if the number of edges on the  boundary of a region is summed over all regions, we have \(2q\geq 4r\) and therefore \(q\geq 2r\text{.}\)</p>
<p id="p-95">Since \(p=6\) and \(q=9\text{,}\) it follows from Euler's Theorem that \(p+r=q+2\) and so \(r=5\text{.}\) But then</p>
<div class="displaymath">
\begin{equation*}
9=q\not&gt;2r=2(5)=10,
\end{equation*}
</div>
<p data-braille="continuation">a contradiction. Therefore \(K_{3,3}\) is not planar.</p></article></div>
<p id="p-96">An <dfn class="terminology">elementary subdivision</dfn> of a graph \(G\) is a graph obtained from \(G\) by removing some edge \(e = uv\) and adding a new vertex \(w\) and edges \(uw\) and \(vw\text{.}\) A <dfn class="terminology">subdivision</dfn> of \(G\) is obtained from \(G\) by a succession of one or more elementary subdivisions.</p>
<article class="example example-like" id="example-graph-subdivision"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">2.5.3</span><span class="period">.</span>
</h6>Subdivisions of \(K_5\) and \(K_{3,3}\text{.}\)</article><figure class="figure figure-like" id="figure-graph-subdivision"><div class="image-box" style="width: 50%; margin-left: 25%; margin-right: 25%;"><img src="/tw314-assets/images/figure_kuratowski1.JPG" style="width: 100%; height: auto;" alt=""></div>
<figcaption><span class="type">Figure</span><span class="space"> </span><span class="codenumber">2.5.4<span class="period">.</span></span><span class="space"> </span></figcaption></figure><p id="p-97">It should be clear that any subdivisions of \(K_5\) and \(K_{3,3}\) are non-planar, since \(K_5\) and \(K_{3,3}\) are non-planar. In general, any subdivisions of a non-planar graph is non-planar. Also, if a graph \(G\) has a subgraph that is non-planar, then \(G\) must also be non-planar.</p>
<p id="p-98">In fact, the following characterization of non-planar graphs shows us that in a sense \(K_5\) and \(K_{3,3}\) are the “building blocks” of all non-planar graph (the proof is omitted for now).</p>
<article class="theorem theorem-like" id="theorem-graph-kuratowski"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">2.5.5</span><span class="period">.</span><span class="space"> </span><span class="title">Kuratowski's theorem.</span>
</h6>A graph \(G\) is a planar graph if and only if \(G\) contains no subgraph isomorphic to \(K_5\) or \(K_{3,3}\) or a subdivision of one of these.</article><article class="example example-like" id="example-graph-petersen"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">2.5.6</span><span class="period">.</span>
</h6>Show that the Petersen graph is non-planar.<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-8"><div class="solution solution-like">
<p id="p-99">The subgraph \(H\) of \(P\) in figure <span class="xref">Figure 1.7.2</span> is a subdivision of \(K_{3,3}\text{.}\)</p>
<figure class="figure figure-like" id="figure-graph-petersen"><div class="image-box" style="width: 50%; margin-left: 25%; margin-right: 25%;"><img src="/tw314-assets/images/figure_kuratowski2.JPG" style="width: 100%; height: auto;" alt=""></div>
<figcaption><span class="type">Figure</span><span class="space"> </span><span class="codenumber">2.5.7<span class="period">.</span></span><span class="space"> </span>The Petersen graph is non-planar</figcaption></figure>
</div></div>
</div></article></section></div>
</div>
