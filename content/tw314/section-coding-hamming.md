---
title: "Hamming distances"
shell: tw314-native
sort_order: 47
---

<div class="tw314-native-document" data-tw314-slug="section-coding-hamming">
<div id="content" class="pretext-content"><section class="section" id="section-coding-hamming"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">8.4</span> <span class="title">Hamming distances</span>
</h2>
<p id="p-484">The <dfn class="terminology">Hamming distance</dfn> \(d({\bf x},{\bf y})\) between two vectors \({\bf x}\) and \({\bf y}\) of \((\mathbf{F}_q)^n\) is the number of places in which they differ.</p>
<p id="p-485">The Hamming distance is a <dfn class="terminology">metric</dfn> (a distance function) since</p>
<ol class="decimal">
<li id="li-140">\(\displaystyle d({\bf x},{\bf y})=0 \iff {\bf x}={\bf y}\)</li>
<li id="li-141">\(\displaystyle d({\bf x},{\bf y})=d({\bf y},{\bf x})\ \forall \ {\bf x},{\bf y}\in(\mathbf{F}_q)^n\)</li>
<li id="li-142">\(\displaystyle d({\bf x},{\bf y})\leq d({\bf x},{\bf z})+d({\bf z},{\bf y})\ \forall \ {\bf x},{\bf y},{\bf z}\in(\mathbf{F}_q)^n\)</li>
</ol>
<p id="p-486">Prove the above as an exercise (for the proof of 3, note that \(d({\bf x},{\bf y})\) is the minimum number of changes of digits required to change \({\bf x}\) to \({\bf y}\)).</p>
<p id="p-487">It may sometimes be useful to represent \((\mathbf{F}_2)^n\) graphically. In <span class="xref">Figure 8.4.1</span> and <span class="xref">Figure 8.4.2</span>, the vectors of \((\mathbf{F}_2)^2\text{,}\) \((\mathbf{F}_2)^3\) and \((\mathbf{F}_2)^4\) are represented by vertices and an edge between two vertices indicates that the two corresponding vectors are Hamming distance one apart, i.e., they differ in precisely one position.</p>
<figure class="figure figure-like" id="figure-coding-3Dcube"><div class="image-box" style="width: 80%; margin-left: 10%; margin-right: 10%;"><img src="/tw314-assets/images/figure_2D3Dcube.jpg" style="width: 100%; height: auto;" alt=""></div>
<figcaption><span class="type">Figure</span><span class="space"> </span><span class="codenumber">8.4.1<span class="period">.</span></span><span class="space"> </span>A graphical respresentation of vectors of length 2 and 3 where two vectors are adjacent if the Hamming distance between them is 1</figcaption></figure><figure class="figure figure-like" id="figure-coding-4Dcube"><div class="image-box" style="width: 60%; margin-left: 20%; margin-right: 20%;"><img src="/tw314-assets/images/figure_4dcube.JPG" style="width: 100%; height: auto;" alt=""></div>
<figcaption><span class="type">Figure</span><span class="space"> </span><span class="codenumber">8.4.2<span class="period">.</span></span><span class="space"> </span>A graphical respresentation of vectors of length 4</figcaption></figure></section></div>
</div>
