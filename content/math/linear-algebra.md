---
title: Linear Algebra Examples
excerpt: Matrix notation, systems, and eigen decomposition examples.
---

## Linear Algebra Examples

### Matrix And Vector Notation

$$
A =
\begin{bmatrix}
1 & 2 & 3 \\
0 & 1 & 4 \\
2 & 0 & 1
\end{bmatrix},
\quad
\vec{x} =
\begin{bmatrix}
x_1 \\
x_2 \\
x_3
\end{bmatrix},
\quad
\vec{b} =
\begin{bmatrix}
1 \\
0 \\
3
\end{bmatrix}
$$

Solve $A\vec{x} = \vec{b}$.

### Determinant And Inverse

$$
\det(A) =
\begin{vmatrix}
a & b \\
c & d
\end{vmatrix}
= ad - bc
$$

If $ad-bc \neq 0$, then

$$
A^{-1} = \frac{1}{ad-bc}
\begin{bmatrix}
d & -b \\
-c & a
\end{bmatrix}
$$

### Eigenvalues

$$
\det(A - \lambda I) = 0
$$

gives the characteristic polynomial for eigenvalues \(\lambda\).
