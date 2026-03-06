---
title: "An algorithm for computing discrete logartihms"
shell: tw314-native
sort_order: 38
---

<div class="tw314-native-document" data-tw314-slug="section-crypto-log-alg">
<div id="content" class="pretext-content"><section class="section" id="section-crypto-log-alg"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">6.4</span> <span class="title">An algorithm for computing discrete logartihms</span>
</h2>
<p id="p-414">Now that we can calculate the inverse of an element of a group, we can get back to the discrete logarithm problem. Remember that finding the discrete logorithm in a finite group is a very expensive calculation and it is for this reason that the Diffie-Hellman key exchange is secure for sufficiently large \(p\text{.}\)</p>
<p id="p-415">We make use of the <dfn class="terminology">baby-step giant-step algorithm</dfn> to calculate the discrete logarithm in a finite group.</p>
<article class="algorithm theorem-like" id="algorithm-7"><h6 class="heading">
<span class="type">Algorithm</span><span class="space"> </span><span class="codenumber">6.4.1</span><span class="period">.</span><span class="space"> </span><span class="title">Baby-step giant-step algoritm.</span>
</h6>
<p id="p-416"></p>
<p id="p-417"><em class="alert">Input:</em> Two elements \(\alpha, \beta\in \mathbf{F}^*_p\)</p>
<p id="p-418"><em class="alert">Output:</em> The discrete logarithm \(x\) such that \(\alpha^x=\beta \pmod{p}\)</p>
<ol class="decimal">
<li id="li-107"><p id="p-419">Set \(m= \lceil\sqrt{p}\rceil\)</p></li>
<li id="li-108"><p id="p-420">Construct a table with entries \((j,\alpha^j)\) for \(0\leq j&lt;m\text{.}\)  Sort this table by second component.</p></li>
<li id="li-109"><p id="p-421">Compute \(\alpha^{-m}\)  and set \(\gamma_0=\beta\)</p></li>
<li id="li-110">
<p id="p-422">FOR \(i\) from \(0\) to \(m-1\) DO:</p>
<p id="p-423">Check if \(\gamma_i\) is the second component of some entry in the table.</p>
<p id="p-424">IF  \(\gamma_i=\alpha^j\)</p>
<p id="p-425">THEN RETURN \(x=im+j\)</p>
<p id="p-426">ELSE \(\gamma_{i+1}= \gamma_i\cdot\alpha^{-m}\)</p>
</li>
</ol></article><p id="p-427">Note that \(\gamma_i=\beta\cdot \alpha^{-im}\text{.}\)</p>
<article class="example example-like" id="example-crypto-log"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">6.4.2</span><span class="period">.</span><span class="space"> </span><span class="title">Discrete logarithm.</span>
</h6>Calculate \(x\) where \(3^x=525 \pmod{809}\text{.}\)<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-35"><div class="solution solution-like"><ol class="decimal">
<li id="li-111">\(\displaystyle m=\lfloor\sqrt{809}\rfloor=29\)</li>
<li id="li-112">
<div class="sidebyside"><div class="sbsrow" style="margin-left:0%;margin-right:0%;"><div class="sbspanel fixed-width" style="width:100%;justify-content:flex-start;"><table>
<tr>
<td class="c m b1 r1 l0 t0 lines">\(j\)</td>
<td class="c m b1 r1 l0 t0 lines">\(0\)</td>
<td class="c m b1 r1 l0 t0 lines">\(1\)</td>
<td class="c m b1 r1 l0 t0 lines">\(2\)</td>
<td class="c m b1 r1 l0 t0 lines">\(3\)</td>
<td class="c m b1 r1 l0 t0 lines">\(4\)</td>
<td class="c m b1 r1 l0 t0 lines">\(5\)</td>
<td class="c m b1 r1 l0 t0 lines">\(6\)</td>
<td class="c m b1 r1 l0 t0 lines">\(7\)</td>
<td class="c m b1 r1 l0 t0 lines">\(8\)</td>
<td class="c m b1 r0 l0 t0 lines" data-braille="last-cell">\(9\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(\alpha^j \pmod{809}\)</td>
<td class="c m b0 r1 l0 t0 lines">\(1\)</td>
<td class="c m b0 r1 l0 t0 lines">\(3\)</td>
<td class="c m b0 r1 l0 t0 lines">\(9\)</td>
<td class="c m b0 r1 l0 t0 lines">\(27\)</td>
<td class="c m b0 r1 l0 t0 lines">\(81\)</td>
<td class="c m b0 r1 l0 t0 lines">\(243\)</td>
<td class="c m b0 r1 l0 t0 lines">\(729\)</td>
<td class="c m b0 r1 l0 t0 lines">\(569\)</td>
<td class="c m b0 r1 l0 t0 lines">\(89\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(267\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines"></td>
<td class="c m b0 r0 l0 t0 lines"></td>
<td class="c m b0 r0 l0 t0 lines"></td>
<td class="c m b0 r0 l0 t0 lines"></td>
<td class="c m b0 r0 l0 t0 lines"></td>
<td class="c m b0 r0 l0 t0 lines"></td>
<td class="c m b0 r0 l0 t0 lines"></td>
<td class="c m b0 r0 l0 t0 lines"></td>
<td class="c m b0 r0 l0 t0 lines"></td>
<td class="c m b0 r0 l0 t0 lines"></td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell"></td>
</tr>
<tr>
<td class="c m b1 r1 l0 t0 lines">\(j\)</td>
<td class="c m b1 r1 l0 t0 lines">\(10\)</td>
<td class="c m b1 r1 l0 t0 lines">\(11\)</td>
<td class="c m b1 r1 l0 t0 lines">\(12\)</td>
<td class="c m b1 r1 l0 t0 lines">\(13\)</td>
<td class="c m b1 r1 l0 t0 lines">\(14\)</td>
<td class="c m b1 r1 l0 t0 lines">\(15\)</td>
<td class="c m b1 r1 l0 t0 lines">\(16\)</td>
<td class="c m b1 r1 l0 t0 lines">\(17\)</td>
<td class="c m b1 r1 l0 t0 lines">\(18\)</td>
<td class="c m b1 r0 l0 t0 lines" data-braille="last-cell">\(19\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(\alpha^j \pmod{809}\)</td>
<td class="c m b0 r1 l0 t0 lines">\(801\)</td>
<td class="c m b0 r1 l0 t0 lines">\(785\)</td>
<td class="c m b0 r1 l0 t0 lines">\(737\)</td>
<td class="c m b0 r1 l0 t0 lines">\(593\)</td>
<td class="c m b0 r1 l0 t0 lines">\(161\)</td>
<td class="c m b0 r1 l0 t0 lines">\(483\)</td>
<td class="c m b0 r1 l0 t0 lines">\(640\)</td>
<td class="c m b0 r1 l0 t0 lines">\(302\)</td>
<td class="c m b0 r1 l0 t0 lines">\(97\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(291\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines"></td>
<td class="c m b0 r0 l0 t0 lines"></td>
<td class="c m b0 r0 l0 t0 lines"></td>
<td class="c m b0 r0 l0 t0 lines"></td>
<td class="c m b0 r0 l0 t0 lines"></td>
<td class="c m b0 r0 l0 t0 lines"></td>
<td class="c m b0 r0 l0 t0 lines"></td>
<td class="c m b0 r0 l0 t0 lines"></td>
<td class="c m b0 r0 l0 t0 lines"></td>
<td class="c m b0 r0 l0 t0 lines"></td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell"></td>
</tr>
<tr>
<td class="c m b1 r1 l0 t0 lines">\(j\)</td>
<td class="c m b1 r1 l0 t0 lines">\(20\)</td>
<td class="c m b1 r1 l0 t0 lines">\(21\)</td>
<td class="c m b1 r1 l0 t0 lines">\(22\)</td>
<td class="c m b1 r1 l0 t0 lines">\(23\)</td>
<td class="c m b1 r1 l0 t0 lines">\(24\)</td>
<td class="c m b1 r1 l0 t0 lines">\(25\)</td>
<td class="c m b1 r1 l0 t0 lines">\(26\)</td>
<td class="c m b1 r1 l0 t0 lines">\(27\)</td>
<td class="c m b1 r0 l0 t0 lines">\(28\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell"></td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(\alpha^j \pmod{809}\)</td>
<td class="c m b0 r1 l0 t0 lines">\(64\)</td>
<td class="c m b0 r1 l0 t0 lines">\(192\)</td>
<td class="c m b0 r1 l0 t0 lines">\(576\)</td>
<td class="c m b0 r1 l0 t0 lines">\(110\)</td>
<td class="c m b0 r1 l0 t0 lines">\(330\)</td>
<td class="c m b0 r1 l0 t0 lines">\(181\)</td>
<td class="c m b0 r1 l0 t0 lines">\(543\)</td>
<td class="c m b0 r1 l0 t0 lines">\(11\)</td>
<td class="c m b0 r0 l0 t0 lines">\(33\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell"></td>
</tr>
</table></div></div></div>
<p id="p-428">Sort by second component:</p>
<div class="sidebyside"><div class="sbsrow" style="margin-left:0%;margin-right:0%;"><div class="sbspanel fixed-width" style="width:100%;justify-content:flex-start;"><table>
<tr>
<td class="c m b1 r1 l0 t0 lines">\(j\)</td>
<td class="c m b1 r1 l0 t0 lines">\(0\)</td>
<td class="c m b1 r1 l0 t0 lines">\(1\)</td>
<td class="c m b1 r1 l0 t0 lines">\(2\)</td>
<td class="c m b1 r1 l0 t0 lines">\(27\)</td>
<td class="c m b1 r1 l0 t0 lines">\(3\)</td>
<td class="c m b1 r1 l0 t0 lines">\(28\)</td>
<td class="c m b1 r1 l0 t0 lines">\(20\)</td>
<td class="c m b1 r1 l0 t0 lines">\(4\)</td>
<td class="c m b1 r1 l0 t0 lines">\(8\)</td>
<td class="c m b1 r0 l0 t0 lines" data-braille="last-cell">\(18\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(\alpha^j \pmod{809}\)</td>
<td class="c m b0 r1 l0 t0 lines">\(1\)</td>
<td class="c m b0 r1 l0 t0 lines">\(3\)</td>
<td class="c m b0 r1 l0 t0 lines">\(9\)</td>
<td class="c m b0 r1 l0 t0 lines">\(11\)</td>
<td class="c m b0 r1 l0 t0 lines">\(27\)</td>
<td class="c m b0 r1 l0 t0 lines">\(33\)</td>
<td class="c m b0 r1 l0 t0 lines">\(64\)</td>
<td class="c m b0 r1 l0 t0 lines">\(81\)</td>
<td class="c m b0 r1 l0 t0 lines">\(89\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(97\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines"></td>
<td class="c m b0 r0 l0 t0 lines"></td>
<td class="c m b0 r0 l0 t0 lines"></td>
<td class="c m b0 r0 l0 t0 lines"></td>
<td class="c m b0 r0 l0 t0 lines"></td>
<td class="c m b0 r0 l0 t0 lines"></td>
<td class="c m b0 r0 l0 t0 lines"></td>
<td class="c m b0 r0 l0 t0 lines"></td>
<td class="c m b0 r0 l0 t0 lines"></td>
<td class="c m b0 r0 l0 t0 lines"></td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell"></td>
</tr>
<tr>
<td class="c m b1 r1 l0 t0 lines">\(j\)</td>
<td class="c m b1 r1 l0 t0 lines">\(23\)</td>
<td class="c m b1 r1 l0 t0 lines">\(14\)</td>
<td class="c m b1 r1 l0 t0 lines">\(25\)</td>
<td class="c m b1 r1 l0 t0 lines">\(21\)</td>
<td class="c m b1 r1 l0 t0 lines">\(5\)</td>
<td class="c m b1 r1 l0 t0 lines">\(9\)</td>
<td class="c m b1 r1 l0 t0 lines">\(19\)</td>
<td class="c m b1 r1 l0 t0 lines">\(17\)</td>
<td class="c m b1 r1 l0 t0 lines">\(24\)</td>
<td class="c m b1 r0 l0 t0 lines" data-braille="last-cell">\(15\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(\alpha^j \pmod{809}\)</td>
<td class="c m b0 r1 l0 t0 lines">\(110\)</td>
<td class="c m b0 r1 l0 t0 lines">\(161\)</td>
<td class="c m b0 r1 l0 t0 lines">\(181\)</td>
<td class="c m b0 r1 l0 t0 lines">\(192\)</td>
<td class="c m b0 r1 l0 t0 lines">\(243\)</td>
<td class="c m b0 r1 l0 t0 lines">\(267\)</td>
<td class="c m b0 r1 l0 t0 lines">\(291\)</td>
<td class="c m b0 r1 l0 t0 lines">\(302\)</td>
<td class="c m b0 r1 l0 t0 lines">\(330\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(483\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines"></td>
<td class="c m b0 r0 l0 t0 lines"></td>
<td class="c m b0 r0 l0 t0 lines"></td>
<td class="c m b0 r0 l0 t0 lines"></td>
<td class="c m b0 r0 l0 t0 lines"></td>
<td class="c m b0 r0 l0 t0 lines"></td>
<td class="c m b0 r0 l0 t0 lines"></td>
<td class="c m b0 r0 l0 t0 lines"></td>
<td class="c m b0 r0 l0 t0 lines"></td>
<td class="c m b0 r0 l0 t0 lines"></td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell"></td>
</tr>
<tr>
<td class="c m b1 r1 l0 t0 lines">\(j\)</td>
<td class="c m b1 r1 l0 t0 lines">\(26\)</td>
<td class="c m b1 r1 l0 t0 lines">\(7\)</td>
<td class="c m b1 r1 l0 t0 lines">\(22\)</td>
<td class="c m b1 r1 l0 t0 lines">\(13\)</td>
<td class="c m b1 r1 l0 t0 lines">\(16\)</td>
<td class="c m b1 r1 l0 t0 lines">\(6\)</td>
<td class="c m b1 r1 l0 t0 lines">\(12\)</td>
<td class="c m b1 r1 l0 t0 lines">\(11\)</td>
<td class="c m b1 r0 l0 t0 lines">\(10\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell"></td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(\alpha^j \pmod{809}\)</td>
<td class="c m b0 r1 l0 t0 lines">\(543\)</td>
<td class="c m b0 r1 l0 t0 lines">\(569\)</td>
<td class="c m b0 r1 l0 t0 lines">\(576\)</td>
<td class="c m b0 r1 l0 t0 lines">\(593\)</td>
<td class="c m b0 r1 l0 t0 lines">\(640\)</td>
<td class="c m b0 r1 l0 t0 lines">\(729\)</td>
<td class="c m b0 r1 l0 t0 lines">\(737\)</td>
<td class="c m b0 r1 l0 t0 lines">\(785\)</td>
<td class="c m b0 r0 l0 t0 lines">\(801\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell"></td>
</tr>
</table></div></div></div>
</li>
<li id="li-113">
<p id="p-429">\(3^{-1}=270\rightarrow 3^{-29}=(3^{-1})^{29}=270^{29}=523\)</p>
<p id="p-430">\(\gamma=525\)</p>
</li>
<li id="li-114">
<div class="sidebyside"><div class="sbsrow" style="margin-left:0%;margin-right:0%;"><div class="sbspanel fixed-width" style="width:100%;justify-content:flex-start;"><table>
<tr>
<td class="c m b1 r1 l0 t0 lines">\(i\)</td>
<td class="c m b1 r1 l0 t0 lines">\(0\)</td>
<td class="c m b1 r1 l0 t0 lines">\(1\)</td>
<td class="c m b1 r1 l0 t0 lines">\(2\)</td>
<td class="c m b1 r1 l0 t0 lines">\(3\)</td>
<td class="c m b1 r1 l0 t0 lines">\(4\)</td>
<td class="c m b1 r1 l0 t0 lines">\(5\)</td>
<td class="c m b1 r1 l0 t0 lines">\(6\)</td>
<td class="c m b1 r1 l0 t0 lines">\(7\)</td>
<td class="c m b1 r1 l0 t0 lines">\(8\)</td>
<td class="c m b1 r1 l0 t0 lines">\(9\)</td>
<td class="c m b1 r0 l0 t0 lines" data-braille="last-cell">\(10\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(\gamma_i=\beta\cdot\alpha^{-im}\)</td>
<td class="c m b0 r1 l0 t0 lines">\(525\)</td>
<td class="c m b0 r1 l0 t0 lines">\(324\)</td>
<td class="c m b0 r1 l0 t0 lines">\(371\)</td>
<td class="c m b0 r1 l0 t0 lines">\(682\)</td>
<td class="c m b0 r1 l0 t0 lines">\(726\)</td>
<td class="c m b0 r1 l0 t0 lines">\(277\)</td>
<td class="c m b0 r1 l0 t0 lines">\(60\)</td>
<td class="c m b0 r1 l0 t0 lines">\(638\)</td>
<td class="c m b0 r1 l0 t0 lines">\(366\)</td>
<td class="c m b0 r1 l0 t0 lines">\(494\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(291\)</td>
</tr>
</table></div></div></div>
<p id="p-431">Since \(\gamma_{10}=3^{19}\text{,}\) \(i=10\) and \(j=19\) and therefore \(x=10\times 29+19=309\text{.}\)</p>
</li>
</ol></div></div>
</div></article></section></div>
</div>
