---
title: "A digital communication system"
shell: tw314-native
sort_order: 45
---

<div class="tw314-native-document" data-tw314-slug="section-coding-channel">
<div id="content" class="pretext-content"><section class="section" id="section-coding-channel"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">8.2</span> <span class="title">A digital communication system</span>
</h2>
<p id="p-471">The object of an error-correcting code is to encode data by adding a certain amount of redundancy to the message, so that the original message can be recovered if (not too many) errors have occurred. A general digital communication system is shown in <span class="xref">Figure 8.2.1</span>. The same model can be used to describe an information storage system if the storage medium is regarded as a channel.</p>
<figure class="figure figure-like" id="figure-coding-channel1"><div class="image-box" style="width: 100%; margin-left: 0%; margin-right: 0%;"><img src="/tw314-assets/images/figure_channel_1.JPG" style="width: 100%; height: auto;" alt=""></div>
<figcaption><span class="type">Figure</span><span class="space"> </span><span class="codenumber">8.2.1<span class="period">.</span></span><span class="space"> </span>A digital communication system</figcaption></figure><p id="p-472">In the simple example shown in <span class="xref">Figure 8.2.2</span>, we wish to send messages "YES" and "NO". Two errors have occurred and the decoder has decoded the received vector 01001 as the “nearest” codeword, which is 00000 or “YES”.</p>
<p id="p-473">Here the code is \(\{00000,11111\}\text{.}\) It is a subset of \((\mathbf{F}_2)^5\text{,}\) where \(\mathbf{F}_2=\{0,1\}\text{.}\) It is a binary <dfn class="terminology">repetition code</dfn> of length 5.  It can detect up to four errors and correct up to two errors.</p>
<figure class="figure figure-like" id="figure-coding-channel2"><div class="image-box" style="width: 100%; margin-left: 0%; margin-right: 0%;"><img src="/tw314-assets/images/figure_channel_2.JPG" style="width: 100%; height: auto;" alt=""></div>
<figcaption><span class="type">Figure</span><span class="space"> </span><span class="codenumber">8.2.2<span class="period">.</span></span><span class="space"> </span>An example of a repitition code of length 5</figcaption></figure></section></div>
</div>
