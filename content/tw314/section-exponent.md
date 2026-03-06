---
title: "Exponentiation"
shell: tw314-native
sort_order: 35
---

<div class="tw314-native-document" data-tw314-slug="section-exponent">
<div id="content" class="pretext-content"><section class="section" id="section-exponent"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">6.1</span> <span class="title">Exponentiation</span>
</h2>
<p id="p-353">To determine \(b^e\pmod n\) we consider two square-multiply algorithms.</p>
<article class="algorithm theorem-like" id="algorithm-3"><h6 class="heading">
<span class="type">Algorithm</span><span class="space"> </span><span class="codenumber">6.1.1</span><span class="period">.</span><span class="space"> </span><span class="title">Right-to-left algorithm.</span>
</h6>
<p id="p-354">Look at the bits of \(e\) from the LSB to the MSB to calculate \(b^e\text{.}\)</p>
<p id="p-355"><em class="alert">Input:</em> Base \(b\) and exponent \(e\text{.}\)</p>
<p id="p-356">\(r=1\)</p>
<p id="p-357">WHILE \(e\neq 0\text{:}\)</p>
<p id="p-358">IF \(e\) is odd THEN \(r=r\times b\)</p>
<p id="p-359">\(b=b\times b\)</p>
<p id="p-360">\(e=\lfloor e/2\rfloor\)</p>
<p id="p-361">RETURN \(r\)</p></article><article class="example example-like" id="example-crypto-rtl"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">6.1.2</span><span class="period">.</span><span class="space"> </span><span class="title">Right-to-left algorithm.</span>
</h6>Consider \(\mathbf{F}_{257}^*\) with generator \(g=3\text{.}\) Calculate \(3^{163}\text{.}\)<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-27"><div class="solution solution-like">
<div class="sidebyside"><div class="sbsrow" style="margin-left:0%;margin-right:0%;"><div class="sbspanel fixed-width" style="width:100%;justify-content:flex-start;"><table>
<tr>
<td class="c m b1 r0 l0 t0 lines">\(e \)</td>
<td class="c m b1 r0 l0 t0 lines">\(b\)</td>
<td class="c m b1 r0 l0 t0 lines" data-braille="last-cell">\(r\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(163\)</td>
<td class="c m b0 r0 l0 t0 lines">\(3\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(1\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(81\)</td>
<td class="c m b0 r0 l0 t0 lines">\(3^2=9\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(3\times 1=3\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(40\)</td>
<td class="c m b0 r0 l0 t0 lines">\(9^2=81\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(9\times 3=27\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(20\)</td>
<td class="c m b0 r0 l0 t0 lines">\(81^2=136\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(27\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(10\)</td>
<td class="c m b0 r0 l0 t0 lines">\(136^2=249\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(27\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(5\)</td>
<td class="c m b0 r0 l0 t0 lines">\(249^2=64\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(27\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(2\)</td>
<td class="c m b0 r0 l0 t0 lines">\(64^2=241\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(64\times 27=186\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(1\)</td>
<td class="c m b0 r0 l0 t0 lines">\(241^2=256\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(186\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(0\)</td>
<td class="c m b0 r0 l0 t0 lines">\(256^2=1\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(256\times 186=71\)</td>
</tr>
</table></div></div></div>
<p id="p-362">Hence \(3^{163}=71\text{.}\)</p>
</div></div>
</div></article><article class="algorithm theorem-like" id="algorithm-4"><h6 class="heading">
<span class="type">Algorithm</span><span class="space"> </span><span class="codenumber">6.1.3</span><span class="period">.</span><span class="space"> </span><span class="title">Left-to-right algorithm.</span>
</h6>
<p id="p-363">Look at the bits of \(e\) from the MSB to the LSB to calculate \(b^e\text{.}\)</p>
<p id="p-364"><em class="alert">Input:</em> Base \(b\) and exponent \(e\geq 0\text{,}\) \(e=[e_{\ell-1},\dots,e_1,e_0]_2\text{.}\)</p>
<p id="p-365">\(r=1\)</p>
<p id="p-366">FOR \(i\) from \(\ell-1\) to 0:</p>
<p id="p-367">\(r=r\times r\)</p>
<p id="p-368">IF \(e[i]=1\) THEN \(r=r\times b\)</p>
<p id="p-369">RETURN \(r\)</p></article><article class="example example-like" id="example-crypto-ltr"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">6.1.4</span><span class="period">.</span><span class="space"> </span><span class="title">Left-to-right algorithm.</span>
</h6>Consider \(\mathbf{F}_{257}^*\) with generator \(g=3\text{.}\) Calculate \(3^{163}\text{.}\)<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-28"><div class="solution solution-like">Note that \(163=[10100011]_2\text{,}\) \(b=3\) and \(r=1\text{.}\) <div class="sidebyside"><div class="sbsrow" style="margin-left:0%;margin-right:0%;"><div class="sbspanel fixed-width" style="width:100%;justify-content:flex-start;"><table>
<tr>
<td class="c m b1 r0 l0 t0 lines">\(i\)</td>
<td class="c m b1 r0 l0 t0 lines">\(e[i]\)</td>
<td class="c m b1 r0 l0 t0 lines" data-braille="last-cell">\(r\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(7\)</td>
<td class="c m b0 r0 l0 t0 lines">\(1\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(1^2\times 3=3\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(6\)</td>
<td class="c m b0 r0 l0 t0 lines">\(0\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(3^2=9\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(5\)</td>
<td class="c m b0 r0 l0 t0 lines">\(1\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(9^2\times 3=243\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(4\)</td>
<td class="c m b0 r0 l0 t0 lines">\(0\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(243^2=196\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(3\)</td>
<td class="c m b0 r0 l0 t0 lines">\(0\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(196^2=123\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(2\)</td>
<td class="c m b0 r0 l0 t0 lines">\(0\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(123^2=223\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(1\)</td>
<td class="c m b0 r0 l0 t0 lines">\(1\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(223^2\times 3=127\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(0\)</td>
<td class="c m b0 r0 l0 t0 lines">\(1\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(127^2\times 3=71\)</td>
</tr>
</table></div></div></div>
<p id="p-370">Hence \(3^{163}=71\text{.}\)</p>
</div></div>
</div></article></section></div>
</div>
