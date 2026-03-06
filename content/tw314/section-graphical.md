---
title: "Graphical sequences"
shell: tw314-native
sort_order: 10
---

<div class="tw314-native-document" data-tw314-slug="section-graphical">
<div id="content" class="pretext-content"><section class="section" id="section-graphical"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">1.6</span> <span class="title">Graphical sequences</span>
</h2>
<p id="p-33">A sequence \(d_1, d_2, \cdots, d_n\) of non-negative integers is a <dfn class="terminology">degree sequence</dfn> of a graph \(G\) if \(G\) has order \(n\) and \(d_1, d_2, \cdots, d_n\) are the degrees of the vertices of \(G\text{.}\) A <dfn class="terminology">graphical sequence</dfn> is a sequence for which there exists a graph \(G\) such that the sequence is the <dfn class="terminology">degree sequence</dfn> of \(G\text{.}\)</p>
<article class="example example-like" id="example-graph-sequence"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">1.6.1</span><span class="period">.</span><span class="space"> </span><span class="title">Graphical sequences.</span>
</h6>
<ol id="p-34" class="decimal">
<li id="li-1"><p id="p-35">The graph \(G\) in <span class="xref">Figure 1.6.2</span> has degree sequence 3, 2, 2, 1. Hence the sequence 3, 2, 2, 1 is graphical.</p></li>
<li id="li-2"><p id="p-36">The sequence 3, 3, 2, 1 is not graphical, since no graph exists with degree sequence 3, 3, 2, 1. (Why?)</p></li>
</ol></article><figure class="figure figure-like" id="figure-graph-sequence1"><div class="image-box" style="width: 40%; margin-left: 30%; margin-right: 30%;"><img src="/tw314-assets/images/figure_sequence1.JPG" style="width: 100%; height: auto;" alt=""></div>
<figcaption><span class="type">Figure</span><span class="space"> </span><span class="codenumber">1.6.2<span class="period">.</span></span><span class="space"> </span>A graph with  degree sequence 3, 2, 2, 1.</figcaption></figure><p id="p-37">The following characterization of graphical sequences is due to Havel (1955) and Hakimi (1962).</p>
<article class="theorem theorem-like" id="theorem-graph-graphical"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">1.6.3</span><span class="period">.</span>
</h6>A sequence \(s: d_1, d_2, \cdots, d_n\) of non-negative integers with \(d_1 \geq d_2 \geq \cdots \geq d_n,\ n \geq 2\) and \(d_1 \geq 1\text{,}\) is graphical if and only if the sequence \(s_1: d_2-1, d_3-1, \cdots, d_{d_1+1}-1, d_{d_1+2}, \cdots, d_n\) is graphical.</article><article class="hiddenproof" id="proof-3"><span class="id-ref original"><h6 class="heading"><span class="type">Proof<span class="period">.</span></span></h6></span></article><div class="hidden-content tex2jax_ignore" id="hk-proof-3"><article class="hiddenproof"><p id="p-38">Assume first that \(s_1\) is graphical, and let \(G_1\) be a graph of order \(n-1\) with degree sequence \(s_1\text{.}\) Label the vertices of \(G\) as \(v_2, v_3, \cdots, v_n\text{,}\) so that</p>
<div class="displaymath">
\begin{equation*}
\deg(v_i) = d_i - 1 \text{ for } 2 \leq i \leq d_1+1
\end{equation*}
</div>
<p data-braille="continuation">and</p>
<div class="displaymath">
\begin{equation*}
\deg(v_i) = d_i \text{ for } d_1 + 2 \leq i \leq n.
\end{equation*}
</div>
<p data-braille="continuation">Construct graph \(G\) by adding a new vertex \(v_1\) and the \(d_1\) edges \(v_1v_i\) for \(2 \leq i \leq d_1 + 1\text{.}\) Then \(G\) has degree sequence \(S\) with \(\deg(v_i) = d_i\) for \(1 \leq i \leq n\text{.}\)</p>
<p id="p-39">Conversely, assume \(S\) is graphical. Among all graphs of order \(n\) with degree sequence \(S\text{,}\) let \(G\) be one with \(V(G) = \{ v_1, v_2, \cdots, v_n \}\) and \(\deg(v_i) = d_i\) for \(i = 1,2,\cdots,n\) such that the sum of the degrees of the vertices adjacent to \(v_1\) is a maximum.</p>
<p id="p-40">We must show that \(v_1\) is adjacent to vertices with degrees \(d_2, d_3, \cdots, d_{d_1 + 1}\text{,}\) for then the graph \(G - v_1\) (the graph \(G\) where the vertex \(v_1\) is removed) has degree sequence \(s_1\text{.}\)</p>
<p id="p-41">Suppose to the contrary that there exist vertices \(v_r\) and \(v_s\) with \(d_r &gt; d_s\) such that \(v_1\) is adjacent to \(v_s\) but not to \(v_r\text{.}\) Since \(d_r &gt; d_s\text{,}\) there is a vertex \(v_t\) such that \(v_t\) is adjacent to \(v_r\) but not to \(v_s\text{.}\) Removing edges \(v_1v_s\) and \(v_rv_t\) and adding edges \(v_1v_r\) and \(v_sv_t\) result in a graph \(G'\) having the same degree sequence as \(G\text{.}\) However, in \(G'\) the sum of the degreesof the vertices adjacent to \(v_1\) is larger than that in \(G\text{,}\) contradicting the choice of \(G\text{.}\)</p></article></div>
<article class="example example-like" id="example-graph-sequence2"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">1.6.4</span><span class="period">.</span>
</h6>Is 5, 4, 3, 3, 2, 2, 1 graphical?<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-2"><div class="solution solution-like">
<div class="sidebyside"><div class="sbsrow" style="margin-left:0%;margin-right:0%;"><div class="sbspanel fixed-width" style="width:100%;justify-content:flex-start;"><table>
<tr>
<td class="l m b0 r0 l0 t0 lines">\(s\text{:}\)</td>
<td class="l m b2 r0 l0 t0 lines">\(5\)</td>
<td class="l m b2 r0 l0 t0 lines">\(\dot{4}\)</td>
<td class="l m b2 r0 l0 t0 lines">\(\dot{3}\)</td>
<td class="l m b2 r0 l0 t0 lines">\(\dot{3}\)</td>
<td class="l m b2 r0 l0 t0 lines">\(\dot{2}\)</td>
<td class="l m b2 r0 l0 t0 lines">\(\dot{2}\)</td>
<td class="l m b2 r0 l0 t0 lines" data-braille="last-cell">\(1\)</td>
</tr>
<tr>
<td class="l m b0 r0 l0 t0 lines">\(s_1'\text{:}\)</td>
<td class="l m b0 r0 l0 t0 lines"></td>
<td class="l m b0 r0 l0 t0 lines">\(3\)</td>
<td class="l m b0 r0 l0 t0 lines">\(2\)</td>
<td class="l m b0 r0 l0 t0 lines">\(2\)</td>
<td class="l m b0 r0 l0 t0 lines">\(1\)</td>
<td class="l m b0 r0 l0 t0 lines">\(1\)</td>
<td class="l m b0 r0 l0 t0 lines" data-braille="last-cell">\(1\)</td>
</tr>
<tr>
<td class="l m b0 r0 l0 t0 lines">\(s_1\text{:}\)</td>
<td class="l m b0 r0 l0 t0 lines"></td>
<td class="l m b2 r0 l0 t0 lines">\(3\)</td>
<td class="l m b2 r0 l0 t0 lines">\(\dot{2}\)</td>
<td class="l m b2 r0 l0 t0 lines">\(\dot{2}\)</td>
<td class="l m b2 r0 l0 t0 lines">\(\dot{1}\)</td>
<td class="l m b2 r0 l0 t0 lines">\(1\)</td>
<td class="l m b2 r0 l0 t0 lines" data-braille="last-cell">\(1\)</td>
</tr>
<tr>
<td class="l m b0 r0 l0 t0 lines">\(s_2'\text{:}\)</td>
<td class="l m b0 r0 l0 t0 lines"></td>
<td class="l m b0 r0 l0 t0 lines"></td>
<td class="l m b0 r0 l0 t0 lines">\(1\)</td>
<td class="l m b0 r0 l0 t0 lines">\(1\)</td>
<td class="l m b0 r0 l0 t0 lines">\(0\)</td>
<td class="l m b0 r0 l0 t0 lines">\(1\)</td>
<td class="l m b0 r0 l0 t0 lines" data-braille="last-cell">\(1\)</td>
</tr>
<tr>
<td class="l m b0 r0 l0 t0 lines">\(s_2\text{:}\)</td>
<td class="l m b0 r0 l0 t0 lines"></td>
<td class="l m b0 r0 l0 t0 lines"></td>
<td class="l m b2 r0 l0 t0 lines">\(1\)</td>
<td class="l m b2 r0 l0 t0 lines">\(\dot{1}\)</td>
<td class="l m b2 r0 l0 t0 lines">\(1\)</td>
<td class="l m b2 r0 l0 t0 lines">\(1\)</td>
<td class="l m b2 r0 l0 t0 lines" data-braille="last-cell">\(0\)</td>
</tr>
<tr>
<td class="l m b0 r0 l0 t0 lines">\(s_3'\text{:}\)</td>
<td class="l m b0 r0 l0 t0 lines"></td>
<td class="l m b0 r0 l0 t0 lines"></td>
<td class="l m b0 r0 l0 t0 lines"></td>
<td class="l m b0 r0 l0 t0 lines">\(0\)</td>
<td class="l m b0 r0 l0 t0 lines">\(1\)</td>
<td class="l m b0 r0 l0 t0 lines">\(1\)</td>
<td class="l m b0 r0 l0 t0 lines" data-braille="last-cell">\(0\)</td>
</tr>
<tr>
<td class="l m b0 r0 l0 t0 lines">\(s_3\text{:}\)</td>
<td class="l m b0 r0 l0 t0 lines"></td>
<td class="l m b0 r0 l0 t0 lines"></td>
<td class="l m b0 r0 l0 t0 lines"></td>
<td class="l m b2 r0 l0 t0 lines">\(1\)</td>
<td class="l m b2 r0 l0 t0 lines">\(\dot{1}\)</td>
<td class="l m b2 r0 l0 t0 lines">\(0\)</td>
<td class="l m b2 r0 l0 t0 lines" data-braille="last-cell">\(0\)</td>
</tr>
<tr>
<td class="l m b0 r0 l0 t0 lines">\(s_4'\text{:}\)</td>
<td class="l m b0 r0 l0 t0 lines"></td>
<td class="l m b0 r0 l0 t0 lines"></td>
<td class="l m b0 r0 l0 t0 lines"></td>
<td class="l m b0 r0 l0 t0 lines"></td>
<td class="l m b0 r0 l0 t0 lines">\(0\)</td>
<td class="l m b0 r0 l0 t0 lines">\(0\)</td>
<td class="l m b0 r0 l0 t0 lines" data-braille="last-cell">\(0\)</td>
</tr>
</table></div></div></div>
<p id="p-42"><span class="xref">Theorem 1.6.3</span> tells us that \(s\) is graphical iff \(s_1\) is graphical iff \(s_2\) is graphical iff \(s_3\) is graphical iff \(s_4\) is graphical. But we know that 0, 0, 0 is graphical - it is the degree sequence of a graph with three vertices and no edges. Therefore \(s_4, s_3, s_2, s_1,\) and \(s\) are all graphical. In fact, we can construct graphs with these degree sequences by "working back-wards" - retracing our steps: see <span class="xref">Figure 1.6.5</span>.</p>
<figure class="figure figure-like" id="figure-graph-sequence2"><div class="image-box" style="width: 50%; margin-left: 25%; margin-right: 25%;"><img src="/tw314-assets/images/figure_sequence2.JPG" style="width: 100%; height: auto;" alt=""></div>
<figcaption><span class="type">Figure</span><span class="space"> </span><span class="codenumber">1.6.5<span class="period">.</span></span><span class="space"> </span>Construction of a graph with graphical sequence 5,4,3,3,2,2,1</figcaption></figure><p id="p-43">Thus \(G\) is a graph with graphical sequence 5,4,3,3,2,2,1. Note that \(G\) is not unique.</p>
</div></div>
</div></article><p id="p-44">Also note that not all graphs can be obtained by this procedure on its degree sequence - an example is the graph \(H\) in <span class="xref">Figure 1.6.6</span> with degree sequence 2, 2, 1, 1, 1, 1.</p>
<figure class="figure figure-like" id="figure-graph-graphical2"><div class="image-box" style="width: 40%; margin-left: 30%; margin-right: 30%;"><img src="/tw314-assets/images/figure_sequence3.JPG" style="width: 100%; height: auto;" alt=""></div>
<figcaption><span class="type">Figure</span><span class="space"> </span><span class="codenumber">1.6.6<span class="period">.</span></span><span class="space"> </span>An example of a graph that cannot be obtained by using the method in <span class="xref">Theorem 1.6.3</span>.</figcaption></figure></section></div>
</div>
