---
title: "Block codes"
shell: tw314-native
sort_order: 46
---

<div class="tw314-native-document" data-tw314-slug="section-coding-block">
<div id="content" class="pretext-content"><section class="section" id="section-coding-block"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">8.3</span> <span class="title">Block codes</span>
</h2>
<p id="p-474">A code in which each codeword is a sequence consisting of a fixed number of \(n\) symbols is called a <dfn class="terminology">block code of length \(n\)</dfn>. There are other types of codes, for example <dfn class="terminology">convolutional codes</dfn>, in this course we shall restrict our attention to block codes and so by “code” we shall always mean “block code”.</p>
<p id="p-475">A <dfn class="terminology">binary code</dfn> \(C\) of length \(n\) is just a subset of \((\mathbf{F}_2)^n=\{a_1a_2\cdots a_n| \ a_i\in \mathbf{F}_2\ \text{ for } \ i=1,2,\ldots,n\}\text{,}\) where \(\mathbf{F}_2=\{0,1\}\text{.}\) The elements of \((\mathbf{F}_2)^n\) are called <dfn class="terminology">vectors</dfn> and the elements of \(C\) are called <dfn class="terminology">codewords</dfn>.</p>
<p id="p-476">The idea is to choose \(C\) in such a way that errors in a codeword (i.e. changes in its digits) can be detected and corrected. The code in <span class="xref">Figure 8.2.2</span> is the binary repetition code of length five. It can be used to detect up to four errors, or it can be used to correct up to two errors.</p>
<p id="p-477">More generally, let \(\mathbf{F}_q=\{0,1,2,\ldots,q-1\}\) and let \((\mathbf{F}_q)^n=\{a_1a_2\cdots a_n| \ a_i\in \mathbf{F}_q\ \text{ for } \ i=1,2,\ldots,n\}\text{.}\)</p>
<p id="p-478">A <dfn class="terminology">\(q\)-ary code</dfn> \(C\) of length \(n\) is a subset of \((\mathbf{F}_q)^n\text{.}\)</p>
<article class="example example-like" id="example-coding-rep"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">8.3.1</span><span class="period">.</span><span class="space"> </span><span class="title">Encoding four messages N,W,E,S into 4-ary codewords..</span>
</h6>Consider the four messages N,W,E,S and the three 4-ary codes \(C_1, C_2\) and \(C_3\text{.}\) Determine how many errors each code can detect and how many errors they can correct. <div class="sidebyside"><div class="sbsrow" style="margin-left:0%;margin-right:0%;"><div class="sbspanel fixed-width" style="width:100%;justify-content:flex-start;"><table>
<tr>
<td class="c m b1 r1 l0 t0 lines">Message</td>
<td class="c m b1 r1 l0 t0 lines">\(C_1\)</td>
<td class="c m b1 r1 l0 t0 lines">\(C_2\)</td>
<td class="c m b1 r0 l0 t0 lines" data-braille="last-cell">\(C_3\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(N\)</td>
<td class="c m b0 r1 l0 t0 lines">\(0\)</td>
<td class="c m b0 r1 l0 t0 lines">\(00\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(000\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(E\)</td>
<td class="c m b0 r1 l0 t0 lines">\(1\)</td>
<td class="c m b0 r1 l0 t0 lines">\(11\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(111\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(S\)</td>
<td class="c m b0 r1 l0 t0 lines">\(2\)</td>
<td class="c m b0 r1 l0 t0 lines">\(22\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(222\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(W\)</td>
<td class="c m b0 r1 l0 t0 lines">\(3\)</td>
<td class="c m b0 r1 l0 t0 lines">\(33\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(333\)</td>
</tr>
</table></div></div></div>
<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-38"><div class="solution solution-like">
<p id="p-479">The codes \(C_1, C_2\) and \(C_3\) are 4-ary repetition codes of lengths 1, 2 and 3 respectively.</p>
<p id="p-480">\(C_1\) is not useful; it cannot even detect a single error.</p>
<p id="p-481">\(C_2\) can detect any single error, but cannot correct the error. For example, suppose we receive the vector 13. We assume that it is more probable that one error was made during transmission than two errors. So we must decode 13 to a codeword “closest” to 13, i.e. to 11 or 33. We also assume that an error in the first position is as likely as an error in the second position. So it is equally probable that the sent codeword was 11 or 33; hence we cannot correct the error.</p>
<p id="p-482">Now \(C_3\) can clearly correct any single error.</p>
</div></div>
</div></article><p id="p-483">We are talking rather loosely about a vector being “closer” to one codeword than another and we now make this concept precise by introducing a distance function on \((\mathbf{F}_q)^n\text{.}\)</p></section></div>
</div>
