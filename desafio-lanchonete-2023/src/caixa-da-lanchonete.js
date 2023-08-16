class CaixaDaLanchonete {

    CardapioPrincipal = [
        ["cafe", 3],
        ["suco", 6.20],
        ["sanduiche", 6.50],
        ["salgado", 7.25],
        ["combo1", 9.50],
        ["combo2", 7.50]
    ];

    CardapioExtra = [
        ["chantily", 1.50],
        ["queijo", 2.00]
    ];

    
    /**
     * Converte String Itens para Object Itens
     *
     * @param {Array} itens
     * @returns {Array}
     */
    itensStringToItensArray(itens) {
        return itens.map(itemString => {
            const [item, quantidade] = itemString.split(',').map(str => str.trim());
            return [item, parseInt(quantidade)];
        })
    }

    
    /**
     * Verifica se é um tipo de pagamento valido
     *
     * @param {String} metodoDePagamento
     */
    verificarTipoDePagamento(metodoDePagamento) {
        if (metodoDePagamento !== "debito" && metodoDePagamento !== "credito" && metodoDePagamento !== "dinheiro") {
            throw new Error("Forma de pagamento inválida!");
        }
    }


    /**
     * Verifica se tem mais de 0 itens no array
     *
     * @param {Array} itens
     */
    verificarItens(itens) {
        if (itens.length === 0) {
            throw new Error("Não há itens no carrinho de compra!");
        }
    }


    /**
     * Verifica se todos os codigos dos itens são válidos
     *
     * @param {Array} itens
     */
    verificarCodigoDosItens(itens) {
        const cardapio = this.CardapioPrincipal.concat(this.CardapioExtra);
        for (const item of itens) {
            const [nome, quantidade] = item;

            const encontrado = cardapio.find(arrItem => {
                const [arrItemNome, arrItemQuantidade] = arrItem;
                return arrItemNome === nome;
            });

            if (encontrado === undefined) {
                throw new Error("Item inválido!");
            }
        }
    }


    /**
     * Verifica a quantidade de cada item pedido
     *
     * @param {Array} itens
     */
    verificarQuantidadeDosItens(itens) {
        for (const item of itens) {
            const [nome, quantidade] = item;
            if (quantidade === 0) {
                throw new Error("Quantidade inválida!");
            }
        }
    }


    /**
     * Verifica se algum item extra esta nos pedidos
     *
     * @param {Array} itens
     */
    verificarExistenciaDeItensExtra(itens) {
        for (const item of itens) {
            const [nome, quantidade] = item;

            if (nome === "chantily") {
                return this.verificarCafe(itens);
            } else if (nome === "queijo") {
                return this.verificarSanduiche(itens);
            }
        }
    }


    /**
     * Verifica se existe o item principal sanduiche quando o cliente pede o adicional queijo
     *
     * @param {Array} itens
     */
    verificarSanduiche(itens) {
        if (itens.find(arrItem => {
            const [arrItemNome, arrItemQuantidade] = arrItem;
            return arrItemNome === "sanduiche";
        }) === undefined) {
            throw new Error("Item extra não pode ser pedido sem o principal");
        };
    }


    /**
     * Verifica se existe o item principal cafe quando o cliente pede o adicional chantily
     *
     * @param {Array} itens
     */
    verificarCafe(itens) {
        if (itens.find(arrItem => {
            const [arrItemNome, arrItemQuantidade] = arrItem;
            return arrItemNome === "cafe";
        }) === undefined) {
            throw new Error("Item extra não pode ser pedido sem o principal");
        };
    }


    /**
     * Calcula preço final do pedido, sem considerar metodo de pagamento
     *
     * @param {Array} itens
     * @returns {number}
     */
    calcularValorFinal(itens) {
        var precoFinal = 0
        const cardapio = this.CardapioPrincipal.concat(this.CardapioExtra);
        for (const item of itens) {
            const [nomeItem, quantidade] = item;
            const [encontradoNome, encontradoPreco] = cardapio.find(arrItem => {
                const [arrItemNome, arrItemQuantidade] = arrItem;
                return arrItemNome === nomeItem;
            });

            precoFinal += (encontradoPreco * quantidade)
        }
        return precoFinal
    }


    /**
     * Calcula desconto ou acrescimo de acordo com método de pagamento do cliente
     *
     * @param {String} metodoDePagamento
     * @param {Array} itens
     * @returns {number}
     */
    calcularDesconto(metodoDePagamento, itens) {
        if (metodoDePagamento === 'dinheiro') {
            return this.calcularValorFinal(itens) * 0.95
        } else if (metodoDePagamento === "credito") {
            return this.calcularValorFinal(itens) * 1.03
        } else {
            return this.calcularValorFinal(itens)
        }
    }


    /**
     * Função Orquestradora
     *
     * @param {String} metodoDePagamento
     * @param {Array} itens
     * @returns {String}
     */
    calcularValorDaCompra(metodoDePagamento, itens) {
        itens = this.itensStringToItensArray(itens)
        try {
            this.verificarTipoDePagamento(metodoDePagamento);
            this.verificarItens(itens);
            this.verificarCodigoDosItens(itens);
            this.verificarQuantidadeDosItens(itens);
            this.verificarExistenciaDeItensExtra(itens);
        } catch (error) {
            return error.message;
        }

        return `R$ ${this.calcularDesconto(metodoDePagamento, itens).toFixed(2).toString().replace(".", ",")}`
    }
}

export { CaixaDaLanchonete };
