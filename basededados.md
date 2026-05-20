## 1) Mensagem na tela

```portugol
programa
{
	funcao inicio()
	{
		escreva("Seja bem-vindo ao sistema!")
	}
}
```

---

## 2) Saudação personalizada

```portugol
programa
{
	funcao inicio()
	{
		cadeia apelido

		escreva("Digite seu apelido: ")
		leia(apelido)

		escreva("Bem-vindo, ", apelido, "! Boa sorte na partida!")
	}
}
```

---

## 3) Cadastro de vendedor

```portugol
programa
{
	funcao inicio()
	{
		cadeia nome
		real vendas

		escreva("Nome do vendedor: ")
		leia(nome)

		escreva("Total vendido: ")
		leia(vendas)

		escreva("O vendedor ", nome, " realizou vendas no valor de R$", vendas, " neste mês.")
	}
}
```

---

## 4) Multiplicação de números

```portugol
programa
{
	funcao inicio()
	{
		inteiro n1, n2, resultado

		escreva("Digite o primeiro número: ")
		leia(n1)

		escreva("Digite o segundo número: ")
		leia(n2)

		resultado = n1 * n2

		escreva("O resultado de ", n1, " x ", n2, " é igual a ", resultado)
	}
}
```

---

## 5) Média de três notas

```portugol
programa
{
	funcao inicio()
	{
		real nota1, nota2, nota3, media

		escreva("Nota 1: ")
		leia(nota1)

		escreva("Nota 2: ")
		leia(nota2)

		escreva("Nota 3: ")
		leia(nota3)

		media = (nota1 + nota2 + nota3) / 3

		escreva("A média final do aluno é ", media)
	}
}
```

---

## 6) Antecessor e sucessor

```portugol
programa
{
	funcao inicio()
	{
		inteiro numero

		escreva("Digite um número: ")
		leia(numero)

		escreva("O número anterior é ", numero - 1, "\n")
		escreva("O próximo número é ", numero + 1)
	}
}
```

---

## 7) Triplo e metade

```portugol
programa
{
	funcao inicio()
	{
		real valor, triplo, metade

		escreva("Digite um valor: ")
		leia(valor)

		triplo = valor * 3
		metade = valor / 2

		escreva("O triplo de ", valor, " é ", triplo, "\n")
		escreva("A metade de ", valor, " é ", metade)
	}
}
```

---

## 8) Conversão de medidas

```portugol
programa
{
	funcao inicio()
	{
		real km

		escreva("Digite uma distância em quilômetros: ")
		leia(km)

		escreva(km, "Km corresponde a:\n")
		escreva(km * 1000, " metros\n")
		escreva(km * 100000, " centímetros\n")
		escreva(km * 1000000, " milímetros")
	}
}
```

---

## 9) Conversão de reais para euros

```portugol
programa
{
	funcao inicio()
	{
		real reais, euros

		escreva("Digite o valor em reais: ")
		leia(reais)

		euros = reais / 6.20

		escreva("Você pode comprar ", euros, " euros.")
	}
}
```

---

## 10) Área de terreno

```portugol
programa
{
	funcao inicio()
	{
		real largura, comprimento, area

		escreva("Digite a largura do terreno: ")
		leia(largura)

		escreva("Digite o comprimento do terreno: ")
		leia(comprimento)

		area = largura * comprimento

		escreva("A área total do terreno é ", area, "m².")
	}
}
```

---

## 11) Área do triângulo

```portugol
programa
{
	funcao inicio()
	{
		real base, altura, area

		escreva("Digite a base do triângulo: ")
		leia(base)

		escreva("Digite a altura do triângulo: ")
		leia(altura)

		area = (base * altura) / 2

		escreva("A área do triângulo é ", area)
	}
}
```

---

## 12) Desconto de 10%

```portugol
programa
{
	funcao inicio()
	{
		real valor, desconto, total

		escreva("Digite o valor da compra: ")
		leia(valor)

		desconto = valor * 0.10
		total = valor - desconto

		escreva("O valor com desconto é R$", total)
	}
}
```

---

## 13) Reajuste salarial

```portugol
programa
{
	funcao inicio()
	{
		real salario, aumento, novoSalario

		escreva("Digite o salário atual: ")
		leia(salario)

		aumento = salario * 0.12
		novoSalario = salario + aumento

		escreva("O novo salário é R$", novoSalario)
	}
}
```

---

## 14) Fatura de internet

```portugol
programa
{
	funcao inicio()
	{
		real gb, total

		escreva("Digite a quantidade de GB utilizados: ")
		leia(gb)

		total = 50 + (gb * 3.5)

		escreva("O valor total da fatura é R$", total)
	}
}
```

---

## 15) Horas extras

```portugol
programa
{
	funcao inicio()
	{
		inteiro horas
		real valor

		escreva("Digite a quantidade de horas extras: ")
		leia(horas)

		valor = horas * 35

		escreva("O valor adicional recebido é R$", valor)
	}
}
```

---

## 16) DESAFIO — Tempo gasto no celular

```portugol
programa
{
	funcao inicio()
	{
		real horasDia, totalHoras, totalDias
		inteiro anos

		escreva("Quantas horas por dia você usa o celular? ")
		leia(horasDia)

		escreva("Há quantos anos você possui esse hábito? ")
		leia(anos)

		totalHoras = horasDia * 365 * anos
		totalDias = totalHoras / 24

		escreva("Você passou aproximadamente ", totalDias, " dias usando o celular.")
	}
}
```

## 17) Multa por velocidade

```portugol id="n7kq21"
programa
{
	funcao inicio()
	{
		real velocidade, multa

		escreva("Digite a velocidade do carro: ")
		leia(velocidade)

		se (velocidade > 80)
		{
			multa = (velocidade - 80) * 5

			escreva("Você foi multado!\n")
			escreva("Valor da multa: R$", multa)
		}
		senao
		{
			escreva("Velocidade dentro do limite permitido.")
		}
	}
}
```

---

## 18) Verificação de voto

```portugol id="m3x8wd"
programa
{
	funcao inicio()
	{
		inteiro nascimento, idade

		escreva("Digite o ano de nascimento: ")
		leia(nascimento)

		idade = 2026 - nascimento

		escreva("Idade: ", idade, " anos\n")

		se (idade >= 16)
		{
			escreva("Você pode votar.")
		}
		senao
		{
			escreva("Você ainda não pode votar.")
		}
	}
}
```

---

## 19) Média do aluno

```portugol id="pk1vza"
programa
{
	funcao inicio()
	{
		cadeia nome
		real nota1, nota2, media

		escreva("Nome do aluno: ")
		leia(nome)

		escreva("Digite a primeira nota: ")
		leia(nota1)

		escreva("Digite a segunda nota: ")
		leia(nota2)

		media = (nota1 + nota2) / 2

		escreva("A média de ", nome, " é ", media, "\n")

		se (media >= 7)
		{
			escreva("O aluno teve um bom aproveitamento.")
		}
		senao
		{
			escreva("O aluno não teve um bom aproveitamento.")
		}
	}
}
```

---

## 20) Número par ou ímpar

```portugol id="s4wq0r"
programa
{
	funcao inicio()
	{
		inteiro numero

		escreva("Digite um número inteiro: ")
		leia(numero)

		se (numero % 2 == 0)
		{
			escreva("O número é PAR.")
		}
		senao
		{
			escreva("O número é ÍMPAR.")
		}
	}
}
```

---

## 21) Ano bissexto

```portugol id="v9zj4p"
programa
{
	funcao inicio()
	{
		inteiro ano

		escreva("Digite um ano: ")
		leia(ano)

		se ((ano % 4 == 0 e ano % 100 != 0) ou (ano % 400 == 0))
		{
			escreva("O ano é bissexto.")
		}
		senao
		{
			escreva("O ano não é bissexto.")
		}
	}
}
```

---

## 22) Alistamento militar

```portugol id="f6n2qe"
programa
{
	funcao inicio()
	{
		inteiro nascimento, idade

		escreva("Digite o ano de nascimento: ")
		leia(nascimento)

		idade = 2026 - nascimento

		se (idade < 18)
		{
			escreva("Faltam ", 18 - idade, " anos para o alistamento.")
		}
		senao
		{
			se (idade == 18)
			{
				escreva("Está na hora de se alistar.")
			}
			senao
			{
				escreva("Já se passaram ", idade - 18, " anos do alistamento.")
			}
		}
	}
}
```

---

## 23) Desconto especial

```portugol id="c1ta8x"
programa
{
	funcao inicio()
	{
		cadeia nome, sexo
		real compras, desconto, total

		escreva("Nome do cliente: ")
		leia(nome)

		escreva("Sexo (M/F): ")
		leia(sexo)

		escreva("Valor das compras: ")
		leia(compras)

		se (sexo == "F" ou sexo == "f")
		{
			desconto = compras * 0.13
		}
		senao
		{
			desconto = compras * 0.05
		}

		total = compras - desconto

		escreva("Valor final com desconto: R$", total)
	}
}
```

---

## 24) Preço da passagem

```portugol id="y7mu4d"
programa
{
	funcao inicio()
	{
		real distancia, preco

		escreva("Digite a distância da viagem em Km: ")
		leia(distancia)

		se (distancia <= 200)
		{
			preco = distancia * 0.50
		}
		senao
		{
			preco = distancia * 0.45
		}

		escreva("O valor da passagem é R$", preco)
	}
}
```

---

## 25) DESAFIO — Formação de triângulo

```portugol id="z8nx6m"
programa
{
	funcao inicio()
	{
		real a, b, c

		escreva("Digite o primeiro segmento: ")
		leia(a)

		escreva("Digite o segundo segmento: ")
		leia(b)

		escreva("Digite o terceiro segmento: ")
		leia(c)

		se ((a < b + c) e (b < a + c) e (c < a + b))
		{
			escreva("É possível formar um triângulo.")
		}
		senao
		{
			escreva("Não é possível formar um triângulo.")
		}
	}
}
```

Baseado na sintaxe do Portugol WebStudio/Portugol Studio utilizando `programa`, `funcao inicio()`, `escreva()` e `leia()`. ([amandanascimento.com][1])

[1]: https://www.amandanascimento.com/post/portugol-webstudio?utm_source=chatgpt.com "Portugol Webstudio"
