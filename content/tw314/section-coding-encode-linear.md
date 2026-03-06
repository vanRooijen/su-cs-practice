---
title: "Encoding with a linear code"
shell: tw314-native
sort_order: 57
---

<div class="tw314-native-document" data-tw314-slug="section-coding-encode-linear">
<div id="content" class="pretext-content"><section class="section" id="section-coding-encode-linear"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">9.3</span> <span class="title">Encoding with a linear code</span>
</h2>
<p id="p-553">Let \(C\) be an \([n,k]\)-code over \(\mathbf{F}_q\) with generator matrix \(G\text{.}\) Since \(|C|=q^k\text{,}\)  we can communicate \(q^k\) distinct messages. First identify the \(q^k\) messages with the \(q^k\) \(k\) tuples of \(V(k,q)\text{.}\) Then encode the message vectors by the map \({\bf u}\rightarrow{\bf u}G\) (it maps the \(k\) dimensional \(V(k,q)\) onto the \(k\) dimensional subspace \(C\) of \(V(n,q)\text{.}\)</p>
<figure class="figure figure-like" id="figure-map"><div class="image-box" style="width: 50%; margin-left: 25%; margin-right: 25%;"><img src="/tw314-assets/images/figure_mapping.JPG" style="width: 100%; height: auto;" alt=""></div>
<figcaption><span class="type">Figure</span><span class="space"> </span><span class="codenumber">9.3.1<span class="period">.</span></span><span class="space"> </span>Encoding with a linear code</figcaption></figure><article class="example example-like" id="example-coding-mapping"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">9.3.2</span><span class="period">.</span><span class="space"> </span><span class="title">Encoding with a linear code.</span>
</h6>Let \(C\) be the binary \([7,4]\) code with generator matrix<div class="displaymath">
\begin{equation*}
\begin{bmatrix}
1&amp;0&amp;0&amp;0&amp;1&amp;0&amp;1\\
0&amp;1&amp;0&amp;0&amp;1&amp;1&amp;1\\
0&amp;0&amp;1&amp;0&amp;1&amp;1&amp;0\\
0&amp;0&amp;0&amp;1&amp;0&amp;1&amp;1
\end{bmatrix}.
\end{equation*}
</div>Encode the message vector \(({\bf u}_1,{\bf u}_2,{\bf u}_3,{\bf u}_4)\text{.}\)<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-45"><div class="solution solution-like">
<p id="p-554">The message vector is encoded as</p>
<div class="displaymath">
\begin{align*}
&amp;[{\bf u_1}\ {\bf u_2} \ {\bf u_3}\ {\bf u_4}] \begin{bmatrix}
1&amp;0&amp;0&amp;0&amp;1&amp;0&amp;1\\
0&amp;1&amp;0&amp;0&amp;1&amp;1&amp;1\\
0&amp;0&amp;1&amp;0&amp;1&amp;1&amp;0\\
0&amp;0&amp;0&amp;1&amp;0&amp;1&amp;1
\end{bmatrix}\\
=&amp; [\underbrace{{\bf u_1}, {\bf u_2}, {\bf u_3}, {\bf u_4}}_{\text{message}}, \underbrace{{\bf u}_1+{\bf u}_2+{\bf u}_3, {\bf u}_2+{\bf u}_3+{\bf u}_4, {\bf u}_1+{\bf u}_2+{\bf u}_4}_{\text{check digits (redundancy for protction against noise)}}]
\end{align*}
</div>
<p id="p-555">The encoding is:</p>
<div class="sidebyside"><div class="sbsrow" style="margin-left:0%;margin-right:0%;"><div class="sbspanel fixed-width" style="width:100%;justify-content:flex-start;"><table>
<tr>
<td class="c m b1 r0 l0 t0 lines">\(V(4,2)\)</td>
<td class="c m b1 r0 l0 t0 lines">\(\rightarrow\)</td>
<td class="c m b1 r0 l0 t0 lines" data-braille="last-cell">\(C\) in \(V(7,2)\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">0000</td>
<td class="c m b0 r0 l0 t0 lines">\(\rightarrow\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">0000000</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">0001</td>
<td class="c m b0 r0 l0 t0 lines">\(\rightarrow\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">0001011</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">0010</td>
<td class="c m b0 r0 l0 t0 lines">\(\rightarrow\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">0010110</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">0011</td>
<td class="c m b0 r0 l0 t0 lines">\(\rightarrow\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">0011101</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">0100</td>
<td class="c m b0 r0 l0 t0 lines">\(\rightarrow\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">0100111</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">0101</td>
<td class="c m b0 r0 l0 t0 lines">\(\rightarrow\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">0101100</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">0110</td>
<td class="c m b0 r0 l0 t0 lines">\(\rightarrow\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">0110001</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">0111</td>
<td class="c m b0 r0 l0 t0 lines">\(\rightarrow\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">0111010</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">1000</td>
<td class="c m b0 r0 l0 t0 lines">\(\rightarrow\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">1000101</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">1001</td>
<td class="c m b0 r0 l0 t0 lines">\(\rightarrow\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">1001110</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">1010</td>
<td class="c m b0 r0 l0 t0 lines">\(\rightarrow\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">1010011</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">1011</td>
<td class="c m b0 r0 l0 t0 lines">\(\rightarrow\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">1011000</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">1100</td>
<td class="c m b0 r0 l0 t0 lines">\(\rightarrow\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">1100010</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">1101</td>
<td class="c m b0 r0 l0 t0 lines">\(\rightarrow\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">1101001</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">1110</td>
<td class="c m b0 r0 l0 t0 lines">\(\rightarrow\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">1110100</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">1111</td>
<td class="c m b0 r0 l0 t0 lines">\(\rightarrow\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">1111111</td>
</tr>
</table></div></div></div>
</div></div>
</div></article></section></div>
</div>
