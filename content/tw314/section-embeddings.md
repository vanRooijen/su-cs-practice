---
title: "Embeddings and plane graphs"
shell: tw314-native
sort_order: 14
---

<div class="tw314-native-document" data-tw314-slug="section-embeddings">
<div id="content" class="pretext-content"><section class="section" id="section-embeddings"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">2.1</span> <span class="title">Embeddings and plane graphs</span>
</h2>
<p id="p-57">A graph that can be drawn in the plane without any of its edges intersecting is called a <dfn class="terminology">planar graph</dfn>, and such a drawing is then called an <dfn class="terminology">embedding</dfn> of the graph.</p>
<article class="example example-like" id="example-graph-planar"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">2.1.1</span><span class="period">.</span><span class="space"> </span><span class="title">Planar graphs.</span>
</h6>Show that the graph \(K_4\) is a planar graph.<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-4"><div class="solution solution-like">
<p id="p-58">The embedding of \(K_4\) in <span class="xref">Figure 2.1.2</span> shows that \(K_4\) is a planar graph.</p>
<figure class="figure figure-like" id="figure-graph-planar"><div class="image-box" style="width: 50%; margin-left: 25%; margin-right: 25%;"><img src="/tw314-assets/images/figure_embedding1.JPG" style="width: 100%; height: auto;" alt=""></div>
<figcaption><span class="type">Figure</span><span class="space"> </span><span class="codenumber">2.1.2<span class="period">.</span></span><span class="space"> </span>\(K_4\) is a planar graph.</figcaption></figure>
</div></div>
</div></article> A <dfn class="terminology">plane graph</dfn> is an actual embedding of a planar graph in the plane. Embedding a graph in the plane is equivalent to embedding it on a sphere. In order to see this, we perform what is called a <dfn class="terminology">stereographic projection</dfn>. Let \(G\) be a graph that is embedded on a sphere \(S\text{;}\) see <span class="xref">Figure 2.1.3</span>. Place \(S\) so that it is tangent to a plane \(\Pi\) at a point \(B\) that is diametrically opposite to a point \(A\) which does not correspond to a vertex of \(G\) and does not lie on an edge of \(G\text{.}\) Then \(G\) may be projected onto \(\Pi\) by mapping each point \(X \not= A\) of \(S\) to a point \(X'\) of \(\Pi\) that intersects the line through \(A\) and \(X\text{.}\) <figure class="figure figure-like" id="figure-graph-stereo"><div class="image-box" style="width: 50%; margin-left: 25%; margin-right: 25%;"><img src="/tw314-assets/images/figure_stereogr.JPG" style="width: 100%; height: auto;" alt=""></div>
<figcaption><span class="type">Figure</span><span class="space"> </span><span class="codenumber">2.1.3<span class="period">.</span></span><span class="space"> </span>Stereographic projection</figcaption></figure><p id="p-59">Let \(G\) be a plane graph. The connected open subsets of the plane that remain when the vertices and edges of \(G\) are removed are called <dfn class="terminology">regions</dfn> of \(G\text{.}\) Every plane graph has exactly one unbounded region, called the <dfn class="terminology">exterior region</dfn> of \(G\text{.}\)</p>
<article class="example example-like" id="example-graph-embedding"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">2.1.4</span><span class="period">.</span><span class="space"> </span><span class="title">Graph embeddings.</span>
</h6>Show that \(K_{2,3}\) is a planar graph by providing a suitable embedding in the plane.<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-5"><div class="solution solution-like">Let \(G\) be the graph \(K_{2,3}\) with bipartition \(V_1 = \{ u_1, u_2 \}, V_2 = \{ v_1, v_2, v_3 \}\text{.}\) An embedding of \(G\) is given in figure <span class="xref">Figure 2.1.5</span>. <figure class="figure figure-like" id="figure-graph-embedding"><div class="image-box" style="width: 50%; margin-left: 25%; margin-right: 25%;"><img src="/tw314-assets/images/figure_embedding2.JPG" style="width: 100%; height: auto;" alt=""></div>
<figcaption><span class="type">Figure</span><span class="space"> </span><span class="codenumber">2.1.5<span class="period">.</span></span><span class="space"> </span>An embedding of \(K_{2,3}\text{.}\)</figcaption></figure><p id="p-60">The exterior region is \(R_3\text{.}\) \(R_1\) has a boundary consisting of vertices \(v_1, v_2, u_1, u_2\) and edges \(u_1v_1, v_1u_2, u_2v_2, v_2u_1\text{.}\) Note that \(G\) has 5 vertices, 6 edges and 3 regions.</p>
</div></div>
</div></article><figure class="figure figure-like" id="figure-graph-planegraphs"><div class="image-box" style="width: 50%; margin-left: 25%; margin-right: 25%;"><img src="/tw314-assets/images/figure_planegraphs.JPG" style="width: 100%; height: auto;" alt=""></div>
<figcaption><span class="type">Figure</span><span class="space"> </span><span class="codenumber">2.1.6<span class="period">.</span></span><span class="space"> </span>Three plane graphs.</figcaption></figure><article class="example example-like" id="example-graph-planegraphs"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">2.1.7</span><span class="period">.</span><span class="space"> </span><span class="title">Plane graphs.</span>
</h6>Determine the number of vertices, edges and regions in each of the graphs in <span class="xref">Figure 2.1.6</span>.<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-6"><div class="solution solution-like">
<div class="sidebyside"><div class="sbsrow" style="margin-left:0%;margin-right:0%;"><div class="sbspanel fixed-width" style="width:100%;justify-content:flex-start;"><table>
<tr>
<td class="l m b2 r0 l0 t0 lines">Plane graph</td>
<td class="l m b2 r0 l0 t0 lines">No. of vertices</td>
<td class="l m b2 r0 l0 t0 lines">No. of edges</td>
<td class="l m b2 r0 l0 t0 lines" data-braille="last-cell">No. of regions</td>
</tr>
<tr>
<td class="l m b0 r0 l0 t0 lines">\(G\)</td>
<td class="l m b0 r0 l0 t0 lines">\(4\)</td>
<td class="l m b0 r0 l0 t0 lines">\(4\)</td>
<td class="l m b0 r0 l0 t0 lines" data-braille="last-cell">\(2\)</td>
</tr>
<tr>
<td class="l m b0 r0 l0 t0 lines">\(H\)</td>
<td class="l m b0 r0 l0 t0 lines">\(6\)</td>
<td class="l m b0 r0 l0 t0 lines">\(5\)</td>
<td class="l m b0 r0 l0 t0 lines" data-braille="last-cell">\(1\)</td>
</tr>
<tr>
<td class="l m b0 r0 l0 t0 lines">\(K\)</td>
<td class="l m b0 r0 l0 t0 lines">\(6\)</td>
<td class="l m b0 r0 l0 t0 lines">\(5\)</td>
<td class="l m b0 r0 l0 t0 lines" data-braille="last-cell">\(2\)</td>
</tr>
</table></div></div></div>
<p id="p-61">Is there a relationship between these three quantities?</p>
</div></div>
</div></article></section></div>
</div>
