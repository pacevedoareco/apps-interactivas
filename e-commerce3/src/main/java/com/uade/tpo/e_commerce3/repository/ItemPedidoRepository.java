package com.uade.tpo.e_commerce3.repository;

import com.uade.tpo.e_commerce3.model.ItemPedido;
import com.uade.tpo.e_commerce3.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemPedidoRepository extends JpaRepository<ItemPedido, Long>{
    List<ItemPedido> findByPedido(Pedido pedido);
}
