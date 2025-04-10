resource "yandex_compute_disk" "boot-disk-1" {
  name     = "boot-disk-1"
  type     = "network-hdd"
  zone     = "ru-central1-d"
  size     = "20"
  # image_id = "fd8sq3r72r0caul0fn37"
  image_id = "fd89esja5ecg35fu6n2t" #container-optimized-image
}

resource "yandex_compute_instance" "vm-1" {
  name        = "terraform1"
  platform_id = "standard-v2"

  resources {
    core_fraction = 50
    cores  = 2
    memory = 8
  }

  boot_disk {
    disk_id = yandex_compute_disk.boot-disk-1.id
  }

  network_interface {
    subnet_id = yandex_vpc_subnet.subnet-1.id
    nat       = true
  }

  metadata = {
    user-data = "${file("D:/ITMO/Devops/meta.yaml")}"
  }

  scheduling_policy {
    preemptible = true
  }  
}

resource "yandex_vpc_network" "network-1" {
  name = "network1"
}

resource "yandex_vpc_subnet" "subnet-1" {
  name           = "subnet1"
  zone           = "ru-central1-d"
  network_id     = yandex_vpc_network.network-1.id
  v4_cidr_blocks = ["192.168.10.0/24"]
}

resource "null_resource" "transfer_docker_compose" {
  connection {
    type = "ssh"
    user = "devopser"
    host = yandex_compute_instance.vm-1.network_interface.0.nat_ip_address
    agent       = true
    timeout     = "1m"
  }  
  provisioner "file" {
    source      = "../docker-compose.yml"
    destination = "/home/devopser/docker-compose.yml"
  }
  depends_on = [yandex_compute_instance.vm-1]
}

resource "null_resource" "docker_compose_run" {
  connection {
    type = "ssh"
    user = "devopser"
    host = yandex_compute_instance.vm-1.network_interface.0.nat_ip_address
    agent       = true
    timeout     = "1m"
  }    
  provisioner "remote-exec" {
    inline = [
      "cd /home/devopser",
      "sudo docker-compose up -d"
    ]    
  }
  depends_on = [null_resource.transfer_docker_compose]
}

output "internal_ip_address_vm_1" {
  value = yandex_compute_instance.vm-1.network_interface.0.ip_address
}

output "external_ip_address_vm_1" {
  value = yandex_compute_instance.vm-1.network_interface.0.nat_ip_address
}