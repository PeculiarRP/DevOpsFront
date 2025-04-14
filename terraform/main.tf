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
    user-data = "${file("../../meta.yaml")}"
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

resource "null_resource" "transfer_yml" {
  connection {
    type = "ssh"
    user = "devopser"
    host = yandex_compute_instance.vm-1.network_interface.0.nat_ip_address
    agent       = true
    timeout     = "1m"
  }  
  provisioner "file" {
    source      = "../miniqube"
    destination = "/home/devopser/miniqube"
  }
  depends_on = [yandex_compute_instance.vm-1]
}

resource "null_resource" "miniqube_run" {
  connection {
    type = "ssh"
    user = "devopser"
    host = yandex_compute_instance.vm-1.network_interface.0.nat_ip_address
    agent       = true
    timeout     = "1m"
  }    
  provisioner "remote-exec" {
    inline = [
      # "cd /home/devopser/miniqube",
      "sudo apt update",
      "sudo apt install curl apt-transport-https",
      "curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64",
      "sudo install minikube-linux-amd64 /usr/local/bin/minikube",
      "minikube version",
      "sudo apt update && sudo apt install ca-certificates",
      "sudo curl -fsSLo /etc/apt/keyrings/kubernetes-archive-keyring.gpg https://packages.cloud.google.com/apt/doc/apt-key.gpg",
      "curl -LO \"https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl\"",
      # "sudo apt update && sudo apt install -y kubectl",
      "chmod +x ./kubectl",
      "sudo mv ./kubectl /usr/local/bin/kubectl",
      "kubectl version --client --short",
      "minikube status",
      "minikube start --driver=docker",
      "eval $(minikube docker-env)",
      "kubectl apply -f /home/devopser/miniqube"
    ]    
  }
  depends_on = [null_resource.transfer_yml]
}

output "internal_ip_address_vm_1" {
  value = yandex_compute_instance.vm-1.network_interface.0.ip_address
}

output "external_ip_address_vm_1" {
  value = yandex_compute_instance.vm-1.network_interface.0.nat_ip_address
}