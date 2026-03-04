---
title: Probability Examples
excerpt: Common formulas in probability and statistics.
---

## Probability Examples

### Bayes' Rule

$$
P(A \mid B) = \frac{P(B \mid A)P(A)}{P(B)}
$$

### Binomial Distribution

$$
P(X=k) = \binom{n}{k} p^k(1-p)^{n-k}
$$

Expectation and variance:

$$
\mathbb{E}[X] = np,\qquad \mathrm{Var}(X)=np(1-p)
$$

### Normal Distribution

$$
f(x) = \frac{1}{\sigma\sqrt{2\pi}}
\exp\left(-\frac{(x-\mu)^2}{2\sigma^2}\right)
$$

### Central Limit Theorem (informal)

If $X_1,\dots,X_n$ are IID with mean $\mu$ and variance $\sigma^2$, then

$$
\frac{\bar{X}_n-\mu}{\sigma/\sqrt{n}} \xrightarrow{d} \mathcal{N}(0,1)
$$
