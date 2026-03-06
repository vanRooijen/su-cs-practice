---
title: "Nearest neighbour decoding"
shell: tw314-native
sort_order: 48
---

<div class="tw314-native-document" data-tw314-slug="section-coding-neighbour">
<div id="content" class="pretext-content"><section class="section" id="section-coding-neighbour"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">8.5</span> <span class="title">Nearest neighbour decoding</span>
</h2>
<p id="p-488">Suppose a codeword \({\bf x}\text{,}\) unknown to us, has been transmitted and that we receive vector \({\bf y}\) which may have been distorted by noise. It seems reasonable to decode \({\bf y}\) as that codeword \({\bf x'}\text{,}\) hopefully \({\bf x}\) such that \(d({\bf x'},{\bf y})\) is as small as possible. This is called <dfn class="terminology">nearest neighbour decoding</dfn>.</p>
<p id="p-489">This strategy for decoding will maximise the decoder's likelihood of correcting transmission errors, provided that the following assumptions about the channel hold:</p>
<ol class="decimal">
<li id="li-143">Each symbol has the same probability \(p&lt;\frac{1}{2}\) of being received in error.</li>
<li id="li-144">If a symbol is received in error, then each of the \(q-1\) possible errors are equally likely.</li>
</ol>
<p id="p-490">A channel satisfying the above two conditions is called a <dfn class="terminology">\(q\)-ary symmetric channel</dfn>.</p>
<figure class="figure figure-like" id="figure-coding-binsymchan"><div class="image-box" style="width: 50%; margin-left: 25%; margin-right: 25%;"><img src="/tw314-assets/images/figure_binsymchan.JPG" style="width: 100%; height: auto;" alt=""></div>
<figcaption><span class="type">Figure</span><span class="space"> </span><span class="codenumber">8.5.1<span class="period">.</span></span><span class="space"> </span>The binary symmetric channel</figcaption></figure><p id="p-491">The binary symmetric channel is depicted in <span class="xref">Figure 8.5.1</span>: \(p\) is called the <dfn class="terminology">symbol error probability</dfn> of the channel. If the binary symmetric channel is assumed and if a particular binary codeword of length \(n\) is transmitted, then the probability that no errors will occur is \((1-p)^n\text{,}\) since each symbol has probability \((1-p)\) of being received correctly. The probability that the received vector has errors in precisely \(i\) specified positions is \(p^i(1-p)^{n-i}\text{.}\) Since \(p&lt;\frac{1}{2}\) the received vector with one error is more likely than any with two or more errors, and so on. This confirms that, for a binary symmetric channel, nearest neighbour decoding is also <dfn class="terminology">maximum likelihood decoding</dfn>.</p></section></div>
</div>
